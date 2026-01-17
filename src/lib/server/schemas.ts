import type { RecordId } from "surrealdb"



export type ElectricRoomFetched =  {
	id: RecordId<"electric_rooms">;
	name: string;
	boards: BoardFetched[];
}
export type BoardFetched =  {
	id: RecordId<"boards">;
	name: string;
	breakers: Breaker[];
}
export type ElectricRoom =  {
	id: RecordId<"electric_rooms">;
	name: string;
}

export type Board =  {
	id: RecordId<"boards">;
	name: string;
	room: RecordId<"electric_rooms">;
}

export type Breaker = {
	id: RecordId<"breakers">;
	name: `Q${number}`;
	value: number;
	board: RecordId<"boards">;
}



export interface BreakerConnection  {
	id: RecordId<"connects">;
	in: RecordId<"breakers">;
	out: RecordId<"breakers">;
}
