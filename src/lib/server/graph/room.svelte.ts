import type { Node, NodeProps } from "@xyflow/svelte";
import type { ElectricRoom } from "$lib/server/schemas";
import defaults from "./utils";
import type { Prettify } from "surrealdb";

export class RoomState {
	data?: ElectricRoom = $state(undefined);
	constructor(fromDb: Prettify<ElectricRoom>) {
		// TODO: validate
		this.data = fromDb;
	}

	createNode(): Node<ElectricRoom> | undefined {
		if (!this.data) return;
		return {
			id: this.data.id.toString(),
			type: "room_group",
			width: defaults.width,
			height: defaults.height,
			position: defaults.position,
			data: this.data
		};
	}

}
