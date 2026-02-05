<script module>
export type Form = {
    [key: string]: {
	label: string,
	description?: string,
	type: "input" | "select" | "button" | "checkbox",
	fieldProps?: object,
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
    form?: Form[],
}
</script>

<script lang="ts">
import type { Component } from "svelte";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import * as Dialog from "./ui/dialog";
import * as Field from "./ui/field";
import * as Input from "./ui/input";
import { Select } from "./ui/select";


let {
    open = $bindable(false),
    onsubmit,
    withCloseButton = true,
    header = "",
    footer = "",
    form = $bindable([]),
}: Props = $props();

function submit(e: SubmitEvent) {
    e.preventDefault();
    console.log(form);
    open = !open;
}

const field: { [key: Form["type"]]: Component } = {
    input: Input.Root,
    select: Select,
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
		<Field.Field >
		    {#each form as item, j}
			{#each Object.entries(item) as [key, data], i}
			    {@const Component = field[data.type]}
			    <Field.Field>
				<Field.Content>
				    {#if data.label}
					<Field.Label for={key}>
					    {data.label}
					</Field.Label>
				    {/if}
				    <Component bind:value={form[j][key].value} {...data.fieldProps} />
				    {#if data.description}
					<Field.Description>
					    {data.description}
					</Field.Description>
				    {/if}
				</Field.Content >
				<Field.Error for={key} errors={data.errors}/>
			    </Field.Field >
			{/each}
		    {/each}
		</Field.Field >
	    </form>
	{/if}
    </Dialog.Content>
    <Dialog.Footer>
	{footer}
    </Dialog.Footer>
</Dialog.Root>
