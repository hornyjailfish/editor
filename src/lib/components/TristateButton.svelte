<script lang="ts">
import { type Node, ControlButton, type ControlButtonProps, useSvelteFlow } from "@xyflow/svelte";

type TristateButtonProps = ControlButtonProps & { nodes: string[] };

let { nodes: ids=$bindable([]), children, ...rest }: TristateButtonProps = $props();

const flowHook = useSvelteFlow();
const nodes = flowHook.getNodes(ids);

let dragState: "draggable" | "partial" | "locked" = $derived.by(()=>{
    return checkDragState(nodes);
});

let buttonProps: ControlButtonProps = $state({
    title: dragState == "draggable" ? "Lock movement" : "Unlock movement",
    color: dragState == "locked" ? "var(--color-red-500)" : "var(--color-sky-300)",
})

$effect(()=>{
    buttonProps.title = dragState == "draggable" ? "Lock movement" : "Unlock movement";
    buttonProps.color = dragState == "locked" ? "var(--color-red-500)" : "var(--color-sky-300)";
})

function checkDragState(nodes: Node[]) {
	if (nodes.every((n)=>n.draggable ?? true)) return "draggable";
	if (nodes.some((n)=>n.draggable ?? true)) return "partial";
	return "locked";
}

const onclick=(e:MouseEvent & {currentTarget: EventTarget & HTMLButtonElement})=>{
    e.stopPropagation();
    console.log(ids);
    for (const node of nodes) {
	const draggable = node.draggable ?? true; // INFO: prevent !undefined ?? false == true
	flowHook.updateNode(node.id,()=>({draggable: !draggable}));
    }
    dragState = checkDragState(nodes);
    rest.onclick(e);
}

</script>

<ControlButton  {onclick} {...buttonProps} type="button">
    {@render children?.()}
</ControlButton>
