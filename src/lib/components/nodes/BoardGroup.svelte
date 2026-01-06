<script lang="ts">
import { fade } from 'svelte/transition';
import { ControlButton, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';
import type { Board } from '$lib/server/schemas';


type Props = {
    data?: Board,
    class?: string
} & NodeProps<Node<Board>>

let node: HTMLDivElement | undefined = $state();



let { id, data, class: className, ...rest }: Props = $props();
id = id || data?.id.toString();

// TODO: validate data by schema here or on fetch?
</script>

<div bind:this={node} class="size-full flex items-stretch">
    <p class="size-full text-stone-300 content-center text-[10px]">{data?.name}</p>
    <NodeToolbar class="text-slate-500 h-full"  position={Position.Right} align="start" nodeId={id}>
	<div class="flex flex-col gap-1 *:rounded-lg" transition:fade>
	    <ControlButton   title="Add board" onclick={()=>console.log("click")}>
		<span class="icon-[material-symbols--add-2-rounded]"></span>
	    </ControlButton>
	</div>
    </NodeToolbar>
    <NodeToolbar class="text-slate-500" offset={-4}  position={Position.Top} align="center" nodeId={id}>
	{data?.name}
    </NodeToolbar>
    <NodeToolbar class="text-slate-500" offset={-5}  position={Position.Bottom} align="start" nodeId={id}>
    </NodeToolbar>
</div>

<style>
:global(.svelte-flow__node-boards.selectable) {
padding: 4px;
border-radius: 2px;
width: "auto";
color: var(--color-stone-200, var(--xy-node-color-default));
background-color: --alpha(var(--color-stone-700, var(--xy-node-background-color-default))/70%);
text-align: center;
border: var(--xy-node-border, var(--xy-node-border-default));
}

:global(.svelte-flow__node-boards.selectable:hover) {
box-shadow: var(--shadow-lg);
}
</style>
