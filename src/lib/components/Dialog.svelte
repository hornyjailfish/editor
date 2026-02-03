<script module>
export type Form = {
    [key: string]: {
	label: string,
	description?: string,
	type: "input" | "select" | "button" | "checkbox" | "radio",
	fieldProps?: unknown,
	value?: unknown,
	errors?: { message?: string }[];
    }
}

export type Props = {
    open?: boolean,
    onsubmit?: (e: SubmitEvent) => void,
    withCloseButton?: boolean,
    header?: string,
    footer?: string,
    form?: Form,
}
</script>

{#snippet input(props)}
    <Input.Root  class="w-full" bind:value={form[0].value} >
	<Input.Input />
    </Input.Root>
{/snippet}

<script lang="ts">
import * as Dialog from "./ui/dialog";
import * as Field from "./ui/field";
import * as Input from "./ui/input";


let {
    open = $bindable(false),
    onsubmit,
    withCloseButton = true,
    header = "",
    footer = "",
    form = $bindable({}),
}: Props = $props();

const field = {
    input: Input.Root,
}

</script>

<Dialog.Root {open} onOpenChange={()=>open=!open}>
    {#if withCloseButton}
	<Dialog.Close />
    {/if}
    <Dialog.Content>
        <Dialog.Header>
	    {header}
        </Dialog.Header>
        <form {onsubmit}>
	    {#if form && Object.keys(form).length == 1}
		{@const [key, data] = Object.entries(form)[0]}
		{@const Component = field[type]}
		<Field.Field>
		    <Field.Content>
			<Field.Label for={key}>
			    {data.label}
			</Field.Label>
			<Input.Root id={key} placeholder={data.fieldProps?.placeholder} class="w-full" bind:value={form[0].value} >
			    <Input.Input />
			</Input.Root>
			<Field.Description>
			    Enter board name
			</Field.Description>
		    </Field.Content >
		    <Field.Error for="name" errors={form.errors}/>
		</Field.Field >
	    {:else}
	    {/if}
        </form>
    </Dialog.Content>
    <Dialog.Footer>
	{footer}
    </Dialog.Footer>
</Dialog.Root>
