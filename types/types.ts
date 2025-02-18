import { topics } from "@/constants/topics"

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

type topic = keyof typeof topics

type section = topic[]

type tab = {
	name: string
	previewName: string
	sections: section[]
}

export type layout = tab[]
