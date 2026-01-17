import { RecordId } from "surrealdb";
import type { Board, Breaker, ElectricRoom } from "./server/schemas";

// 1. Electric Rooms (main distribution rooms/areas)
export const fakeElectricRooms: ElectricRoom[] = [
	{ id: new RecordId("electric_rooms", "01H9K2P4M7N8Q3R"), name: "Щ 1-10" },
	{ id: new RecordId("electric_rooms", "01H9K2P5T2V9W4X"), name: "Щ 2-0" },
	{ id: new RecordId("electric_rooms", "01H9K2P6Y8Z1A5B"), name: "Щ -3-2" },
	{ id: new RecordId("electric_rooms", "01H9K2P7C3D6E9F"), name: "Щ 3-8" },
];

// 2. Boards (sub-distribution boards / MDB / SDB)
export const fakeBoards: Board[] = [
	// Room 1 - Main
	{ id: new RecordId("boards", "01H9K3M8R4T7V2W"), name: "ВРУ 13", room: new RecordId("electric_rooms","01H9K2P4M7N8Q3R") },
	{ id: new RecordId("boards", "01H9K3M9X5Y2Z8A"), name: "ЩО 67", room: new RecordId("electric_rooms","01H9K2P4M7N8Q3R") },
	{ id: new RecordId("boards", "01H9K3N1B6C9D4E"), name: "ЩР 8", room: new RecordId("electric_rooms","01H9K2P4M7N8Q3R") },

	// Room 2 - Server
	{ id: new RecordId("boards","01H9K3N2F7G3H9J"), name: "ЩР 31", room: new RecordId("electric_rooms","01H9K2P5T2V9W4X") },
	{ id: new RecordId("boards","01H9K3N3K8L4M0N"), name: "АВР 7", room: new RecordId("electric_rooms","01H9K2P5T2V9W4X") },

	// Room 3 - Workshop
	{ id: new RecordId("boards","01H9K3N4P9Q5R1S"), name: "ЩР 69", room: new RecordId("electric_rooms","01H9K2P6Y8Z1A5B") },

	// Room 4 - Offices
	{ id: new RecordId("boards","01H9K3N5T0U6V2W"), name: "ЩО 11", room: new RecordId("electric_rooms","01H9K2P7C3D6E9F") },
	{ id: new RecordId("boards","01H9K3N6X1Y7Z3A"), name: "Office Floor 2 Sockets", room: new RecordId("electric_rooms","01H9K2P7C3D6E9F") },
];

// 3. Breakers (with realistic Qxx naming)
export const fakeBreakers: Breaker[] = [
	// MDB-001 Main Incoming
	{ id: new RecordId("breakers","01H9K4P7R2T9V5W"), name: "Q1", value: 630, board: new RecordId("boards","01H9K3M8R4T7V2W") },   // main incomer
	{ id: new RecordId("breakers","01H9K4P8X3Y0Z6A"), name: "Q2", value: 250, board: new RecordId("boards","01H9K3M8R4T7V2W") },   // to lighting sub
	{ id: new RecordId("breakers","01H9K4P9B4C1D7E"), name: "Q3", value: 400, board: new RecordId("boards","01H9K3M8R4T7V2W") },   // to power sub
	{ id: new RecordId("breakers","01H9K5Q1F5G2H8J"), name: "Q4", value: 160, board: new RecordId("boards","01H9K3M8R4T7V2W") },   // spare

	// SDB-GF Lighting
	{ id: new RecordId("breakers","01H9K5Q2K6L3M9N"), name: "Q1", value: 40, board: new RecordId("boards","01H9K3M9X5Y2Z8A") },
	{ id: new RecordId("breakers","01H9K5Q3P7Q4R0S"), name: "Q2", value: 32, board: new RecordId("boards","01H9K3M9X5Y2Z8A") },
	{ id: new RecordId("breakers","01H9K5Q4T8U5V1W"), name: "Q3", value: 25, board: new RecordId("boards","01H9K3M9X5Y2Z8A") },
	{ id: new RecordId("breakers","01H9K5Q5X9Y6Z2A"), name: "Q4", value: 16, board: new RecordId("boards","01H9K3M9X5Y2Z8A") },

	// Server Room Critical Power
	{ id: new RecordId("breakers","01H9K5Q6B0C7D3E"), name: "Q1", value: 100, board: new RecordId("boards","01H9K3N3K8L4M0N") },   // UPS feed
	{ id: new RecordId("breakers","01H9K5Q7F1G8H4J"), name: "Q2", value: 63, board: new RecordId("boards","01H9K3N3K8L4M0N") },
	{ id: new RecordId("breakers","01H9K5Q8K2L9M5N"), name: "Q3", value: 32, board: new RecordId("boards","01H9K3N3K8L4M0N") },

	// Workshop Main Board
	{ id: new RecordId("breakers","01H9K5Q9P3Q0R6S"), name: "Q1", value: 125, board: new RecordId("boards","01H9K3N4P9Q5R1S") },   // main machines
	{ id: new RecordId("breakers","01H9K6R1T4U1V7W"), name: "Q2", value: 80, board: new RecordId("boards","01H9K3N4P9Q5R1S") },
	{ id: new RecordId("breakers","01H9K6R2X5Y2Z8A"), name: "Q3", value: 50, board: new RecordId("boards","01H9K3N4P9Q5R1S") },

	// Office Floor 2 Sockets
	{ id: new RecordId("breakers","01H9K6R3B6C3D9E"), name: "Q1", value: 32, board: new RecordId("boards","01H9K3N6X1Y7Z3A") },
	{ id: new RecordId("breakers","01H9K6R4F7G4H0J"), name: "Q2", value: 32, board: new RecordId("boards","01H9K3N6X1Y7Z3A") },
	{ id: new RecordId("breakers","01H9K6R5K8L5M1N"), name: "Q3", value: 20, board: new RecordId("boards","01H9K3N6X1Y7Z3A") },
];
