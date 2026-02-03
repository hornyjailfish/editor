<script lang="ts">
import { fade } from 'svelte/transition';
import { ControlButton, NodeToolbar, Position, useSvelteFlow, type Node, type NodeProps } from '@xyflow/svelte';
import type { Board } from '$lib/server/schemas';


type Props = {
    data?: Board,
    class?: string
} & NodeProps<Node<Board>>

let node: HTMLDivElement | undefined = $state();

const { getZoom } = useSvelteFlow();
const zoom = $derived.by(getZoom);


let { id, data, class: className, ...rest }: Props = $props();
id = id || data?.id.toString();

// TODO: validate data by schema here or on fetch?
</script>

<div bind:this={node} class="size-full flex items-stretch">
    {#if zoom<0.8}
	<p class="size-full text-stone-300 content-center text-[1em]">{data?.name}</p>
    {/if}
</div>
    <NodeToolbar class="text-slate-500 h-full"  position={Position.Right} align="start" nodeId={id}>
	<div class="flex flex-col gap-1 *:rounded-lg" transition:fade>
	    <ControlButton   title="Add board" onclick={()=>console.log("click")}>
		<span class="icon-[material-symbols--add-2-rounded]"></span>
	    </ControlButton>
	</div>
    </NodeToolbar>
    <NodeToolbar isVisible={zoom>0.8} class="text-slate-500 text-md" offset={-4}  position={Position.Top} align="center" nodeId={id}>
	{data?.name}
    </NodeToolbar>

<style>
:global(.svelte-flow__node-boards.selectable) {
border-radius: 2px;
width: "auto";
color: var(--color-stone-200, var(--xy-node-color-default));
background-color: --alpha(var(--color-stone-700, var(--xy-node-background-color-default))/40%);
text-align: center;
border: var(--xy-node-border, var(--xy-node-border-default));
}

:global(.svelte-flow__node-boards.selected) {
    border: 1px solid var(--color-emerald-500);
}

:global(.svelte-flow__node-boards.selected:hover) {
    border: 1px solid var(--color-emerald-300);
}

:global(.svelte-flow__node-boards.selectable:hover) {
box-shadow: var(--shadow-lg);
}
</style>
