<script lang="ts">
import { onMount, type Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { fade } from "svelte/transition";
import { useResizeObserver } from "runed";
import {  NodeResizer, NodeToolbar, Position, useInternalNode, useOnSelectionChange, useSvelteFlow, type Node } from "@xyflow/svelte";
import type { NodeProps } from "@xyflow/system";
import { Flow } from "$lib/utils";

import { Toolbar } from "$lib/client/toolbar.svelte";

type ZoomOption = {};

type Props = NodeProps<Node> & HTMLAttributes<HTMLDivElement> & {
    children?: Snippet<[{ ref: (el: HTMLElement)=> void}]>;
    zoomOption?: ZoomOption;
};

let { id, zoomOption, data, type, class: className, children, ...rest }: Props = $props();

let selectedNodes = $state<string[]>([]);


useOnSelectionChange(({nodes})=>{
    const selection = nodes.filter(n=>n.selected);
    selectedNodes = selection.map(n=>n.id);
});

let selected = $derived.by(()=>selectedNodes.length > 0 && selectedNodes.every(item=>item == id));
let resizeable = $state(false);

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
    maxWidth: 128,
    maxHeight: 128,
});

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

useResizeObserver(()=>content, ([info])=>{
    if (!content || !info) return;
    resizeProps.minWidth = clamp(info.contentRect.width, content.scrollWidth , resizeProps.maxWidth)+8;
    resizeProps.minHeight = clamp(info.contentRect.height, content.scrollHeight, resizeProps.maxHeight)+8;
});

const flow = useSvelteFlow();
const node = flow.getInternalNode(id);

function onclick(e: MouseEvent) {
    e.stopPropagation();
    if (!node) return;
    flow.fitBounds(flow.getNodesBounds([node]),{ padding: .1 });
}
</script>

<NodeResizer {...resizeProps} isVisible={selected && resizeable} color="var(--color-yellow-100)" class="rounded-lg" nodeId={id} />
<div transition:fade bind:this={content} class="size-full flex items-stretch">
    {@render children?.({ref: setRef})}
</div>
