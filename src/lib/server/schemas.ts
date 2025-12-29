import type { RecordId } from "surrealdb"


export type ElectricRoom =  {
	id: RecordId<"electric_rooms">;
	name: string;
	boards: RecordId<"boards">[];
}

export type Board =  {
	id: RecordId<"boards">;
	name: string;
	breakers: RecordId<"breakers">[];
}

export type Breaker = {
	id: RecordId<"breakers">;
	name: string;
	value: number;
}

export interface BreakerConnection  {
	id: RecordId<"connects">;
	in: RecordId<"breakers">;
	out: RecordId<"breakers">;
}
