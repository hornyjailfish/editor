import { type Node, type NodeProps } from '@xyflow/svelte';
import type { PageServerLoad } from './$types';
import { surreal, isConnected } from '$lib/server/surreal';
import { jsonify, Table, type Prettify } from 'surrealdb';
import { error } from '@sveltejs/kit';
import type { Board, ElectricRoom } from '$lib/server/schemas';
import { GraphBase } from '$lib/server/graph/base.svelte';


export const load: PageServerLoad = async ({ params }) => {
	const graph = new GraphBase();
	const rootTable = new Table('electric_rooms');
	const dbReady = await isConnected();
	if (!dbReady) {
		error(500, 'db not connected');
	}
	await surreal.ready;
	const res = await surreal.select<Prettify<ElectricRoom>>(rootTable);
	// TODO: validate
	const groups = res.map(async (r) => {
		const roomNode = graph.sur2flow<ElectricRoom>(r)
		graph.addNode(roomNode);
		const boards = await Promise.all(r.boards.map(async (b) => {
			const board = await surreal.select<Prettify<Board>>(b);
			const boardNode = graph.sur2flow<Board>(board, {width: 64, height: ""});
			graph.setParentId(roomNode, boardNode, true);
			graph.addNode(boardNode);
			return jsonify(boardNode);
		}));
		return jsonify([...boards, roomNode]);
	});
	const out = await Promise.all(groups);
	return { electric_rooms: jsonify(graph.nodes) };
};
