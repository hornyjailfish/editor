import { jsonify, Table, type ActionResult, type Prettify, type QueryResult } from 'surrealdb';
import { error } from '@sveltejs/kit';
import type { Node, NodeProps } from "@xyflow/svelte";
import type { PageServerLoad } from './$types';
import { surreal, isConnected } from '$lib/server/surreal';
import type { Board, BoardFetched, Breaker, ElectricRoom, ElectricRoomFetched } from '$lib/server/schemas';
import { GraphBase } from '$lib/server/graph/base.svelte';
import { fakeElectricRooms, fakeBoards, fakeBreakers } from '$lib/fake_data';
import { Flow } from '$lib/utils';

function toNode(item: ActionResult<{}>, parentId_filedName?: string): Node {
	return {
		id: item.id.toString(),
		type: item.id.tb,
		data: item,
		parentId: parentId_filedName ? item[parentId_filedName].toString(): undefined,
		...Flow.dimensions[item.id.tb],
		...Flow.flowOptions[item.id.tb],
	}
}


export const load: PageServerLoad = async ({ params }) => {
	const rootTable = new Table("breakers");
	const dbReady = await isConnected();
	if (!dbReady) {
		error(500, 'db not connected');
	}
	await surreal.ready;
	const res = await surreal.select<Prettify<Breaker>>(rootTable);
	console.log(res);

	const rooms = fakeElectricRooms.map(r=>{
		return toNode(r);
	});
	const boards = fakeBoards.map(r=>{
		return toNode(r, "room");
	});
	const breakers = fakeBreakers.map(r=>{
		return toNode(r, "board");
	});
	const test_data: Node[] = [].concat(rooms, boards, breakers);

	// TODO: validate
	//
	return { nodes: jsonify(test_data) };
};
