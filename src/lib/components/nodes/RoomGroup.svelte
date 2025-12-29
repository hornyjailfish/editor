<script lang="ts">
    import { fade } from 'svelte/transition';
    import { ControlButton, NodeResizer, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';
    import { useOnSelectionChange, useViewport, useSvelteFlow, useInternalNode } from '@xyflow/svelte';
    import { RecordId } from 'surrealdb';
    import { twMerge } from 'tailwind-merge';
    import CustomControlButton from '../CustomControlButton.svelte';

    import { getBoards } from "../../../routes/room.remote";
    import type {  Board, ElectricRoom } from '$lib/server/schemas';

    type Props = {
	data?: ElectricRoom,
	class?: string
	} & NodeProps<Node<ElectricRoom>>

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

    const boards: Board[] = $derived(await getBoards(data.boards));

    let editTitle = $state(false);

    let name = $state(data?.name);

    const viewport = useViewport();
    const flow = useSvelteFlow();
    const node = useInternalNode(id);

    function ondblclick(e: MouseEvent) {
	e.stopPropagation();
	if (!node) return;
	flow.fitBounds(flow.getNodesBounds([node.current!]),{ padding: .1 });
    }

    const resizebuttonColor = $derived.by(()=>{
	if (resizeable) {
	    return "bg-yellow-100 hover:bg-yellow-200";
	}
	return "bg-slate-100 hover:bg-sky-200";
    });
    let zoom = $derived(viewport.current.zoom > 1);

    const onfocus = (e: FocusEvent &{ currentTarget: EventTarget & HTMLInputElement})=>e.currentTarget.select()
    // isConnectable = false; // always false for groups
    // TODO: validate data by schema here or on fetch?
</script>
<div {ondblclick} transition:fade class="size-full" role="list">
    {#if !zoom}
	<NodeToolbar class="text-slate-500" offset={0}  position={Position.Top} align="start" nodeId={id}>
	    <CustomControlButton type="button" class="hover:text-orange-400" title="Edit board" onclick={ondblclick}>
		<span class="icon-[solar--pen-new-round-bold-duotone]"></span>
	    </CustomControlButton>
	</NodeToolbar>
	<div class="flex flex-row text-center justify-center items-center w-full h-full">
	    <p class="font-bold text-5xl text-slate-400">{name}</p>
	</div>
    {:else}
	{#each boards as b}
	    <h1>{b.name}</h1>
	{/each}
	<NodeResizer isVisible={selected && resizeable} color="var(--color-yellow-100)" class="rounded-lg" nodeId={id} />
	<NodeToolbar class="text-slate-500 h-full"  position={Position.Right} align="start" nodeId={id}>
	    <div class="flex flex-col gap-1 *:rounded-lg" transition:fade>
		<ControlButton  title="Add board" onclick={()=>console.log("click")}>
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
	<NodeToolbar class="text-slate-500" offset={-5}  position={Position.Bottom} align="start" nodeId={id}>
	    <p class="font-extralight italic size-auto">{data?.id}</p>
	</NodeToolbar>
    {/if}
</div>
<style>
:global(.svelte-flow__node-electric_rooms.selectable) {
    padding: 10px;
    padding-bottom: 0px;
    border-radius: 8px;
    width: 150px;
    font-size: 10px;
    color: var(--xy-node-group-background-color-default, var(--xy-node-group-background-color-default));
    text-align: center;
    border: var(--xy-node-border, var(--xy-node-border-default));
    background-color: var(--xy-node-group-background-color, var(--xy-node-group-background-color-default));
    backdrop-filter: blur(1px);
}
:global(.svelte-flow__node-electric_rooms.selectable:hover) {
    box-shadow: var(--shadow-lg);
}
:global(.svelte-flow__node-electric_rooms.selectable.selected) {
    border: 1px solid var(--color-emerald-500);
    box-shadow: var(--shadow-2xl);
}
</style>
