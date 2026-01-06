import * as Custom from "$lib/components/nodes";
import type { Node, Dimensions, Edge, NodeTypes, XYPosition, NodeProps } from "@xyflow/svelte";
import type { NodeBase } from "@xyflow/system";
import type { ElkLayoutAlgorithmDescription, ElkNode, LayoutOptions } from "elkjs/lib/elk-api";

export type NodeDimensions = Dimensions & { position: XYPosition };

export default {
	type: "group",
	width: 128,
	height: 128,
	position: { x: 0, y: 0 },
}
// INFO: type infered from id.tb (table name)
export const roomDimensions = {
	width: 512,
	height: 512,
	position: { x: 0, y: 0 },
}

export const boardDimensions = {
	width: 32,
	height: 32,
	position: { x: 0, y: 0 },
}

export const breakerDimensions = {
	width: 16,
	height: 16,
	position: { x: 0, y: 0 },
}

export type FlowOptions = {
	nodeTypes: NodeTypes,
	dimensions: { [key: string]: NodeDimensions },
	flowOptions: { [key: string]: Omit<NodeBase, "id" | "data" | "type" | "position"> },
	layoutOptions: { [key: string]: LayoutOptions },
};
export const Flow: FlowOptions = {
	nodeTypes: {
		electric_rooms: Custom.BasedRoom,
		boards: Custom.BasedBoard,
		breakers: Custom.BasedBreaker,
		root_breakers: Custom.BasedRootBreaker,
	},
	dimensions: {
		electric_rooms: roomDimensions,
		boards: boardDimensions,
		breakers: breakerDimensions,
		root_breakers: breakerDimensions,
	},
	flowOptions: {
		electric_rooms: {
			connectable: false,
			deletable: false,
			expandParent: true,
		},
		boards: {
			connectable: false,
			draggable: false,
			expandParent: true,
		},
		breakers: {
			connectable: true,
			draggable: false,
			expandParent: true,
		},
		root_breakers: {
			connectable: true,
			draggable: false,
			expandParent: true,
		},
	},
	layoutOptions: {
		electric_rooms: {
			"elk.algorithm": "rectpacking",
			"elk.direction": "DOWN",
		},
		boards: {
			"elk.algorithm": "rectpacking",
			"elk.direction": "RIGHT",
		},
		breakers: {
			"elk.algorithm": "layered",
		},
		root_breakers: {
			"elk.algorithm": "layered",
			"elk.direction": "DOWN",
		},
	},
};


let nodes: Node[] = [];
let edges: Edge[] = [];
type ElkWithData = ElkNode & Partial<{ type: string, data: any }>
export function elk2flow(elk: ElkWithData, parentId?: string): Node | Node[] {
	if (!elk.type) {
		elk.type = "default";
	}
	const dimensions = Flow.dimensions[elk.type]; // TODO: this could error
	const position = {
		x: elk.x || dimensions.position.x,
		y: elk.y || dimensions.position.y,
	};
	let flow: Node = {
		id: elk.id,
		parentId,
		extent: parentId ? "parent" : null,
		width: elk.width || dimensions.width,
		height: elk.height || dimensions.height,
		position,
		data: elk.data,
		type: elk.type,
		...Flow.flowOptions[elk.type], // TODO: fix type
	};
	if (elk.edges) {
		// TODO: they pretty similar
	}

	let tree: Array<Node[]> | Node[] = [flow];
	if (!elk.children || elk.children.length === 0) {
		// nodes.push(flow);
		return tree;
	}

	for (const node of elk.children) {
		const item = elk2flow(node, elk.id)
		tree.push(item);
	}
	return tree.flat();
	// return { nodes, edges };
	// return flow;
}
