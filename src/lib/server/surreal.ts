import { error } from '@sveltejs/kit';
import { Surreal } from 'surrealdb';

export const surreal = new Surreal();

export async function isConnected() {
	try {
<<<<<<< HEAD
		const isConnected = surreal.connect('ws://localhost:8008/rpc', {
			database: 'dev',
=======
		return await surreal.connect('ws://localhost:8008/rpc', {
			database: 'test',
>>>>>>> rewrite/db
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
