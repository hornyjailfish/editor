<script module>
export type FormTypes = "input" | "select" | "button" | "checkbox";
export type Form = {
    [key: string]: {
	label: string,
	description?: string,
	type: FormTypes,
	fieldProps?: object,
	value?: unknown,
	errors?: { message?: string }[];
    }
};

export type Props = {
    open?: boolean,
    onsubmit: (values: {[key: string]: any}) => void,
    withCloseButton?: boolean,
    header?: string,
    footer?: string,
    form: Form,
};
</script>

<script lang="ts">
import type { Component } from "svelte";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import  * as Select  from "./ui/select";
import { Input } from "./ui/input";

import * as Dialog from "./ui/dialog";
import * as Field from "./ui/field";


let {
    open = $bindable(false),
    onsubmit,
    withCloseButton = true,
    header = "",
    footer = "",
    form,
}: Props = $props();

function submit(e: SubmitEvent) {
    e.preventDefault();
    open = !open;
    const out = Object.entries(form).map(([key, data])=>{
	return { [key]: data.value }
    });
    onsubmit(out);
}

const field: { [key in FormTypes]: Component<typeof Input | typeof Select.Root | typeof Button | typeof Checkbox> } = {
    input: Input,
    select: Select.Root,
    button: Button,
    checkbox: Checkbox,
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
	{#if form }
	    <form onsubmit={submit}>
		<Field.Group >
		    <!-- {#each form as item, j} -->
			{#each Object.entries(form) as [key, data], i}
			    {@const Component = field[data.type]}
				<Field.Content>
				    {#if data.label}
					<Field.Label for={key}>
					    {data.label}
					</Field.Label>
				    {/if}
				    <Component bind:value={form[key].value} {...data.fieldProps} />
				    {#if data.description}
					<Field.Description>
					    {data.description}
					</Field.Description>
				    {/if}
				</Field.Content >
				<Field.Error for={key} errors={data.errors}/>
			{/each}
		    <!-- {/each} -->
		    <Button type="submit">Submit</Button>
		</Field.Group >
	    </form>
	{/if}
    </Dialog.Content>
    <Dialog.Footer>
	{footer}
    </Dialog.Footer>
</Dialog.Root>
