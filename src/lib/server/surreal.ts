import { Surreal } from 'surrealdb';

export const surreal = new Surreal();

export async function isConnected() {
	try {
		return await surreal.connect('ws://localhost:8008/rpc', {
			database: 'test',
			namespace: 'test',
			auth: {
				username: 'root',
				password: 'root'
			}
		});
	} catch (e) {
		return false;
	}
}
