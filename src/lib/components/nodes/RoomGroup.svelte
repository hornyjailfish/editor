<script lang="ts">
import { fade } from 'svelte/transition';
import { ControlButton, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';
import { useOnSelectionChange, useViewport, useSvelteFlow, useInternalNode } from '@xyflow/svelte';

import type { ElectricRoom } from '$lib/server/schemas';

type Props = {
    data?: ElectricRoom,
    class?: string
} & NodeProps<Node<ElectricRoom>>
let { id, data, class: className, type, ...rest }: Props = $props();

let content: HTMLDivElement | undefined = $state();

id = id || data?.id.toString();


let editName = $state(false);
let name = $state(data?.name);

const viewport = useViewport();
const flow = useSvelteFlow();
const node = useInternalNode(id);

function ondblclick(e: MouseEvent) {
    e.stopPropagation();
    if (!node) return;
    flow.fitBounds(flow.getNodesBounds([node.current!]),{ padding: .1 });
}

let zoom = $derived(viewport.current.zoom > 1);
const childs = flow.getNodes().filter(n=>n.parentId == id);

$effect(()=>{
    childs.forEach(n=>{
	flow.updateNode(n.id,(n)=>{return {hidden: !zoom}})
    });
});
const onfocus = (e: FocusEvent &{ currentTarget: EventTarget & HTMLInputElement})=>e.currentTarget.select()

// TODO: validate data by schema here or on fetch?

let clientNodes: Node[] = [];
function addBoard(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {

}
</script>

<div {ondblclick} bind:this={content} transition:fade class="room size-full" role="list">
    {#if !zoom}
	<div class="flex flex-row text-center justify-center items-center w-full h-full">
	    <p class="font-bold text-5xl text-slate-400/20">{name}</p>
	</div>
    {:else}
	<NodeToolbar class="text-slate-500 h-full"  position={Position.Right} align="start" nodeId={id}>
	    <div class="flex flex-col gap-1 *:rounded-lg" transition:fade>
		<ControlButton title="Add board" onclick={addBoard}>
		    <span class="icon-[material-symbols--add-2-rounded]"></span>
		</ControlButton>
	    </div>
	</NodeToolbar>
	<NodeToolbar class="text-slate-500" offset={-4}  position={Position.Top} align="center" nodeId={id}>
	    {#if editName}
		<!-- svelte-ignore a11y_autofocus -->
		<input autofocus {onfocus} class="w-full text-lg focus:bg-yellow-50 text-slate-500 bg-transparent" bind:value={name} onblur={()=>editName=false}>
	    {:else}
		<p ondblclick={()=>{editName=true}} class="font-bold text-lg text-slate-500">{name}</p>
	    {/if}
	</NodeToolbar>
	<NodeToolbar class="text-slate-500" offset={-5}  position={Position.Bottom} align="start" nodeId={id}>
	    <p class="font-extralight italic size-auto">{data?.id}</p>
	</NodeToolbar>
    {/if}
</div>

<style>
.room {
font-size: 10px;
color: var(--xy-node-group-background-color-default, var(--xy-node-group-background-color-default));
text-align: left;
}
:global(.svelte-flow__node-electric_rooms) {
padding: 10px;
font-size: 10px;
background-color: var(--xy-node-group-background-color-default, var(--xy-node-group-background-color-default));
text-align: center;
border: 1px dashed --alpha(var(--color-stone-500)/30%);
backdrop-filter: blur(2px);
}
:global(.svelte-flow__node-electric_rooms.selectable.selected) {
border: 1px solid var(--color-emerald-500);
box-shadow: var(--shadow-2xl);
}
:global(.svelte-flow__node-electric_rooms.selectable.selected:not(.draggable)) {
border: 1px solid var(--color-yellow-500);
box-shadow: var(--shadow-2xl);
}
:global(.svelte-flow__node-electric_rooms:not(.draggable)) {
padding: 10px;
font-size: 10px;
background-color: var(--xy-node-group-background-color-default, var(--xy-node-group-background-color-default));
text-align: center;
border: 1px dashed --alpha(var(--color-yellow-400)/30%);
backdrop-filter: blur(2px);
}

</style>
