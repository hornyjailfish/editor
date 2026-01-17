import type { PageServerLoad } from './$types';
import { surreal, isConnected } from '$lib/server/surreal';
import { jsonify, Table, type Prettify } from 'surrealdb';

import type {
	Board,
	BoardFetched,
	Breaker,
	ElectricRoom,
	ElectricRoomFetched
} from '$lib/server/schemas';
import { GraphBase } from '$lib/server/graph/base.svelte';
import type { NodeProps } from '@xyflow/svelte';
import { toast } from 'svelte-sonner';

export const load: PageServerLoad = async ({ params }) => {
	const graph = new GraphBase();
	const rootTable = new Table('electric_rooms');
	try {
		const dbReady = await isConnected();
	} catch (e: any) {
		return {
			error: e.body.message
		}
	}
	await surreal.ready;
	const [res] = await surreal.query<Prettify<ElectricRoomFetched[]>[]>(
		'select * from $table fetch boards, boards.*.breakers;',
		{ table: rootTable }
	);
	// TODO: validate
	const rooms = res.map((r) => {
		const roomNodeOpts: Partial<Omit<NodeProps, 'id' | 'data' | 'type'>> = { isConnectable: false };
		const roomNode = GraphBase.sur2flow<ElectricRoomFetched>(r, roomNodeOpts);
		graph.addNode(roomNode);
		const elkRoom = GraphBase.sur2elkN(r);
		if (r.boards.length === 0) {
			return elkRoom;
		}

		const boards = r.boards.map((board) => {
			const boardNodeOpts: Partial<Omit<NodeProps, 'id' | 'data' | 'type'>> = {
				isConnectable: false,
				draggable: false
			};
			const boardNode = GraphBase.sur2flow<BoardFetched>(board, boardNodeOpts);
			GraphBase.setParentId(roomNode, boardNode, true);
			graph.addNode(boardNode);
			const elkBoard = GraphBase.sur2elkN(board);
			if (board.breakers.length === 0) {
				return elkBoard;
			}

			const breakers = board.breakers.map((breaker) => {
				const breakerNodeOpts: Partial<Omit<NodeProps, 'id' | 'data' | 'type'>> = {
					isConnectable: true,
					draggable: false
				};
				const breakerNode = GraphBase.sur2flow<Breaker>(breaker, breakerNodeOpts);
				GraphBase.setParentId(boardNode, breakerNode, true);
				graph.addNode(breakerNode);
				return GraphBase.sur2elkN(breaker); // TODO: EDGES
			});
			GraphBase.addElkChildren(breakers, elkBoard);
			return elkBoard;
		});
		GraphBase.addElkChildren(boards, elkRoom);
		return elkRoom;
	});
	GraphBase.addElkChildren(rooms, graph.elkRoot);
	//
	// const groups = res.map(async (r) => {
	// 	const roomNode = graph.sur2flow<ElectricRoom>(r)
	// 	graph.addNode(roomNode);
	// 	const boards = await Promise.all(r.boards.map(async (b) => {
	// 		const board = await surreal.select<Prettify<Board>>(b);
	// 		const boardNode = graph.sur2flow<Board>(board, {width: 64, height: ""});
	// 		graph.setParentId(roomNode, boardNode, true);
	// 		graph.addNode(boardNode);
	// 		const breakerNode = board.breakers.map(async (b) => {
	// 			const breaker = await surreal.select<Prettify<Breaker>>(b);
	// 			const breakerNode = graph.sur2flow<Breaker>(breaker, {width: 16, height: 32});
	// 			graph.setParentId(boardNode, breakerNode, true);
	// 			graph.addNode(breakerNode);
	// 			return jsonify(breakerNode);
	// 		});
	// 		return jsonify([boardNode, ...breakerNode]);
	// 	}));
	// 	return jsonify([...boards, roomNode]);
	// });
	// const out = await Promise.all(groups);

	return {
		nodes: jsonify(graph.nodes),
		edges: jsonify(graph.edges),
		elkTree: jsonify(graph.elkRoot)
	};
};
