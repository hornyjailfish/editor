<script lang="ts">
    import { fade } from 'svelte/transition';
    import { ControlButton, NodeResizer, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';
    import { useOnSelectionChange } from '@xyflow/svelte';
    import { RecordId } from 'surrealdb';
    import { twMerge } from 'tailwind-merge';
    import CustomControlButton from '../CustomControlButton.svelte';
    import type { Board } from '$lib/server/schemas';


    type Props = {
	data?: Board,
	class?: string
    } & NodeProps<Node<Board>>

    let selected = $state(false);
    let resizeable = $state(false);

    useOnSelectionChange(({nodes})=>{
	if (nodes.some(n=>n.id == id)) {
	    selected = true;
	}
	else {
	    selected = false;
	    editTitle = false;
	}
    });

    let { id, data, class: className, ...rest }: Props = $props();
    id = id || data?.id.toString();
    let editTitle = $state(false);
    let name = $state(data?.name);

    const resizebuttonColor = $derived.by(()=>{
	if (resizeable) {
	    return "bg-yellow-100 hover:bg-yellow-200";
	}
	return "bg-slate-100 hover:bg-sky-200";
    });
    const onfocus = (e: FocusEvent &{ currentTarget: EventTarget & HTMLInputElement})=>e.currentTarget.select()
    // TODO: validate data by schema here or on fetch?
</script>

<div class="size-full flex items-stretch">
    <p class="size-full text-amber-300 text-[10px]">{data?.name}</p>
</div>
<NodeResizer isVisible={selected && resizeable} color="var(--color-yellow-100)" class="rounded-lg" nodeId={id} />
<NodeToolbar class="text-slate-500 h-full"  position={Position.Right} align="start" nodeId={id}>
    <div class="flex flex-col gap-1 *:rounded-lg" transition:fade>
	<ControlButton   title="Add board" onclick={()=>console.log("click")}>
	    <span class="icon-[material-symbols--add-2-rounded]"></span>
	</ControlButton>
	<CustomControlButton type="button" class={twMerge(resizebuttonColor)} title="Add board" onclick={()=>resizeable=!resizeable}>
	    <span class="icon-[material-symbols--resize-rounded]"></span>
	</CustomControlButton>
    </div>
</NodeToolbar>
<NodeToolbar class="text-slate-500" offset={-4}  position={Position.Top} align="center" nodeId={id}>
</NodeToolbar>
<NodeToolbar class="text-slate-500" offset={-5}  position={Position.Bottom} align="start" nodeId={id}>
</NodeToolbar>

<style>
:global(.svelte-flow__node-boards.selectable) {
    padding: 4px;
    border-radius: 0px;
    width: "auto";
    color: var(--xy-node-color, var(--xy-node-color-default));
    text-align: center;
    border: var(--xy-node-border, var(--xy-node-border-default));
    background-color: var(--color-slate-100, var(--xy-node-background-color-default));
}
:global(.svelte-flow__node-boards.selectable:hover) {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-emerald-100, var(--xy-node-border-color-default));
}
</style>
