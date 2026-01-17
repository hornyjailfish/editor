import { error } from '@sveltejs/kit';
import { Surreal } from 'surrealdb';

export const surreal = new Surreal();

export async function isConnected() {
	try {
		const isConnected = surreal.connect('ws://localhost:8008/rpc', {
			database: 'dev',
			namespace: 'test',
			auth: {
				username: 'root',
				password: 'root'
			}
		});
		return await isConnected;
	} catch (e) {
		error(500,'db not connected');
	}
}
