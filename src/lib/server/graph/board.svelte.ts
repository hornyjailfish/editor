import type { Node, NodeProps } from "@xyflow/svelte";
import type { Board } from "$lib/server/schemas";
import defaults from "./utils";
import type { Prettify } from "surrealdb";

export class BoardState {
	data?: Board = $state(undefined);
	constructor(fromDb: Prettify<Board>) {
		// TODO: validate
		this.data = fromDb;
	}

	createNode(): Node<Board> | undefined {
		if (!this.data) return;
		return {
			id: this.data.id.toString(),
			type: "board_group",
			width: defaults.width,
			height: defaults.height,
			position: defaults.position,
			data: this.data
		};
	}
}
