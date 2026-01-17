import { jsonify, Table, type Prettify } from 'surrealdb';
import { error } from '@sveltejs/kit';
import type { Node } from "@xyflow/svelte";
import type { PageServerLoad } from './$types';
import { surreal, isConnected } from '$lib/server/surreal';
import type { Breaker } from '$lib/server/schemas';
import { fakeElectricRooms, fakeBoards, fakeBreakers } from '$lib/fake_data';
import { toNode, toElk } from '$lib/utils';




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
