export type examStatus = "CREATED" | "IN-PROGRESS" | "COMPLETED"

export type examInfo = {
	id: number
	name: string
	size: number
	status: examStatus
	mathStart: number
	mathEnd: number
	physicsStart: number
	physicsEnd: number
	chemistryStart: number
	chemistryEnd: number
}

export type examDBInfo = Omit<examInfo, "id">

export type examPreview = Omit<
	examInfo,
	| "mathStart"
	| "mathEnd"
	| "physicsStart"
	| "physicsEnd"
	| "chemistryStart"
	| "chemistryEnd"
>
