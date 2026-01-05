import { type Node, useSvelteFlow, type ControlButtonProps, type OnSelectionChange, type Edge } from "@xyflow/svelte";
import { Position, type Align, type Rect } from "@xyflow/system";
import type { Snippet } from "svelte";

import { DeleteButton, FitViewButton, Lock, } from "$lib/client/snippets.svelte";
import type { ToolbarItem } from "./toolbar_item.svelte";


export type Controls = { item: Snippet<[ControlButtonProps]>, props: ControlButtonProps | any, condition?: ()=>boolean, update?: ()=>void }

export class Toolbar {
	flowHook = useSvelteFlow();
	selectedNodes: Node[] = $state([]);
	selectionBounds: Rect = $derived(this.flowHook.getNodesBounds(this.selectedNodes));
	isVisible: boolean = $derived(this.selectedNodes.length>0);
	nodeId: string[] = $derived(this.selectedNodes.map(n=>n.id));
	align: Align = $derived.by(()=>this.selectedNodes.length>1 ? "center" : "end");
	position: Position = $derived.by(()=>this.selectedNodes.length>1 ? Position.Bottom : Position.Bottom);



	initialDragState: "draggable" | "partial" | "locked" = $derived.by(()=>{
	if (this.selectedNodes.every((n)=>n.draggable ?? true)) return "draggable";
	if (this.selectedNodes.some((n)=>n.draggable ?? true)) return "partial";
	return "locked";
	});
	dragState: "draggable" | "partial" | "locked" = $state(this.initialDragState);
	lockColor: string = $derived.by(()=>{
		if (this.dragState === "locked") return "var(--color-red-500)";
		if (this.dragState === "partial") return "var(--color-yellow-500)";
		return "var(--color-sky-300)";
	});

	checkDragState(nodes: Node[]) {
		if (nodes.every((n)=>n.draggable ?? true)) return "draggable";
		if (nodes.some((n)=>n.draggable ?? true)) return "partial";
		return "locked";
	}

	constructor() {
		this.controls = this.defaultControls;
	}

	update(nodes: Node[], edges: Edge[]) {
		this.selectedNodes = nodes;
		this.availableControls.forEach((c)=>{ if (c.update) c?.update() }); // TODO: temporary
	}

	addControl(control: Controls) {
		this.controls.push(control);
	}

	getNodeTypes() {
		return this.selectedNodes.map(n=>n.type);
	}

	getNodeIds() {
		return this.selectedNodes.map(n=>n.id);
	}

	controls: Controls[] = $state([]);

	defaultControls = [
		{
			item: FitViewButton,
			props: {
				title: "Fit view",
				color: "var(--color-orange-300)",
				onclick: (_: MouseEvent)=>{this.flowHook.fitView({ duration: 200, padding: "8px", nodes: this.selectedNodes })}
			},
		},
		{
			item: Lock,
			props: {
				title: this.dragState == "draggable" ? "Lock movement" : "Unlock movement",
				color: this.lockColor,
				nodes: this.nodeId,
				onclick: (_: MouseEvent)=>{
					// const nodes = this.flowHook.getNodes(this.getNodeIds());
					// for (const node of nodes) {
					// 	const draggable = node.draggable ?? true; // INFO: prevent !undefined ?? false == true
					// 	this.flowHook.updateNode(node.id,(node)=>({draggable: !draggable}));
					// }
					// this.dragState = this.checkDragState(nodes);
				}
			}
		},
		{
			item: DeleteButton,
			props: {
				title: "Delete",
				bgColorHover: "var(--color-rose-400)",
				onclick: (_: MouseEvent)=>{		// TODO: delete
					console.log("delete handler");
				}
			},
			condition: ()=>this.selectedNodes.some((n)=>n.deletable ?? true)
		}
	];

	availableControls: Controls[] = $derived.by(()=>this.controls.filter(c=>c.condition?.() ?? true));

}
