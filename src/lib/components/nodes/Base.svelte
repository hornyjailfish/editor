<script lang="ts">
import { onMount, type Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { fade } from "svelte/transition";
import { useResizeObserver, watch } from "runed";
import {  NodeResizer, useNodesInitialized, useOnSelectionChange, useSvelteFlow, type Node } from "@xyflow/svelte";
import type { NodeProps } from "@xyflow/system";
import { Flow } from "$lib/utils";


import { resizer } from "$lib/components/Graph.svelte";

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
    maxWidth: Flow.dimensions[type].width*4,
    maxHeight: Flow.dimensions[type].height*4,
});

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
let once = $state(true);

const ready = $derived(useNodesInitialized().current);

useResizeObserver(()=>content, ([info])=>{
    if (!content || !info) return;
    resizeProps.minWidth = clamp(info.contentRect.width, content.scrollWidth , resizeProps.maxWidth)+8;
    resizeProps.minHeight = clamp(info.contentRect.height, content.scrollHeight, resizeProps.maxHeight)+8;
        node.width = info.contentRect.width<resizeProps.maxWidth?info.contentRect.width:resizeProps.maxWidth
        node.height = info.contentRect.height<resizeProps.maxHeight?info.contentRect.height:resizeProps.maxHeight
    if (node && once) { // TODO: just move it onMount?
        once = false;
        node.width = content.scrollWidth
        node.height = content.scrollHeight
        flow.updateNode(id, node);
    }
});
const flow = useSvelteFlow();
const node = flow.getNode(id)

</script>

<NodeResizer {...resizeProps} isVisible={selected && resizeable} color="var(--color-orange-400)" lineClass="h-8" nodeId={id} />
<div transition:fade bind:this={content} class="size-full flex items-stretch" {...rest}>
    {@render children?.({ref: setRef})}
</div>
