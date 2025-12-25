<script lang="ts">
    import { fade } from 'svelte/transition';
    import { ControlButton, NodeResizer, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';
    import { useOnSelectionChange } from '@xyflow/svelte';
    import { RecordId } from 'surrealdb';
	import { twMerge } from 'tailwind-merge';
	import CustomControlButton from '../CustomControlButton.svelte';

    type Room = {
	    id: RecordId<"electric_rooms">
	    name: string
	    boards: RecordId<"boards">[]
    };

    type Props = {
	data?: Room
	class?: string
    } & NodeProps<Node<Room,"group">>

    let selected = $state(false);
    let resizeable = $state(false);

    useOnSelectionChange(({nodes})=>{
	console.log("nodes", nodes);
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
    // isConnectable = false; // always false for groups
    // TODO: validate data by schema here or on fetch?
</script>
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
    {#if editTitle}
	<input autofocus {onfocus} class="w-full text-lg focus:bg-yellow-50 text-slate-500 bg-transparent" bind:value={name} onblur={()=>editTitle=false}>
    {:else}
	<p ondblclick={()=>{editTitle=true}} class="font-bold text-lg text-slate-500">{name}</p>
    {/if}
</NodeToolbar>
<NodeToolbar isVisible class="text-slate-500" offset={-5}  position={Position.Bottom} align="start" nodeId={id}>
    <p class="font-extralight italic size-auto">{data?.id}</p>
</NodeToolbar>

<style>
:global(.svelte-flow__node-board_group.selectable) {
    padding: 10px;
    padding-bottom: 0px;
    border-radius: 0px;
    width: "auto";
    color: var(--xy-node-color, var(--xy-node-color-default));
    text-align: center;
    border: var(--xy-node-border, var(--xy-node-border-default));
    background-color: var(--color-slate-100, var(--xy-node-background-color-default));
}
:global(.svelte-flow__node-board_group.selectable:hover) {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-emerald-100, var(--xy-node-border-color-default));
}
</style>
