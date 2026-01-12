<script lang="ts">
import { onMount, type Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { fade } from "svelte/transition";
import { useResizeObserver } from "runed";
import {  ControlButton, NodeResizer, NodeToolbar, Position, useInternalNode, useOnSelectionChange, useSvelteFlow, type ControlButtonProps, type Node } from "@xyflow/svelte";
import type { NodeProps } from "@xyflow/system";
import { Flow } from "$lib/utils";


import { resizer } from "$lib/components/Graph.svelte";

type ZoomOption = {};

type Props = NodeProps<Node> & HTMLAttributes<HTMLDivElement> & {
    children?: Snippet<[{ ref: (el: HTMLElement)=> void}]>;
    zoomOption?: ZoomOption;
};

let { id, zoomOption, data, type, class: className, children }: Props = $props();

let selectedNodes = $state<string[]>([]);


useOnSelectionChange(({nodes})=>{
    const selection = nodes.filter(n=>n.selected);
    selectedNodes = selection.map(n=>n.id);
});

let selected = $derived.by(()=>selectedNodes.length > 0 && selectedNodes.every(item=>item == id));

let resizeable = $derived(selected && $resizer.get(id));

let content: HTMLElement | null = $state(null);
function setRef(el: HTMLElement) {
    content = el;
};

onMount(()=>{
    if (!content) return;
    resizeProps.minWidth = content.scrollWidth;
    resizeProps.minHeight = content.scrollHeight;
});

let resizeProps = $state({
    minWidth: Flow.dimensions[type].width,
    minHeight: Flow.dimensions[type].height,
    maxWidth: Flow.dimensions[type].width*2,
    maxHeight: Flow.dimensions[type].height*2,
});

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

useResizeObserver(()=>content, ([info])=>{
    if (!content || !info) return;
    resizeProps.minWidth = clamp(info.contentRect.width, content.scrollWidth , resizeProps.maxWidth)+8;
    resizeProps.minHeight = clamp(info.contentRect.height, content.scrollHeight, resizeProps.maxHeight)+8;
});

const flow = useSvelteFlow();

// const resizeControlProps = $derived.by<ControlButtonProps>(()=>{
//     if (resizeable) {
// 	return {
// 	    title: "Disable resizing",
// 	    color: "var(--color-orange-500)",
// 	    bgColorHover: "var(--color-orange-500)",
// 	    borderColor: "var(--color-orange-500)",
// 	    style: "border: 1px solid var(--color-orange-600)",
// 	};
//     }
//     return {
// 	title: "Enable resizing",
//     };
// });
</script>

<NodeResizer {...resizeProps} isVisible={selected && resizeable} color="var(--color-orange-400)" lineClass="h-8" nodeId={id} />
<div transition:fade bind:this={content} class="size-full flex items-stretch">
    {@render children?.({ref: setRef})}
</div>
