import type { PageServerLoad } from './$types';
import { surreal, isConnected } from '$lib/server/surreal';
import { jsonify } from 'surrealdb';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const dbReady = await isConnected();
	if (!dbReady) {
		error(500, 'db not connected');
	}
	await surreal.ready;
	const res = await surreal.select('electric_rooms');
	const groups = res.map(r => {
		return {
			id: r.id,
			type: 'room_group',
			width: 200,
			height: 200,
			position: { x: 0, y: 0 },
			data: r
		}
	});
	return { electric_rooms: jsonify(groups) };
};
