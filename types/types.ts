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

export type questionStatus = "CORRECT" | "WRONG" | "UNANSWERED"

export type subject =
	| "CALCULUS"
	| "GEOMETRY"
	| "DISCRETE"
	| "STATISTICS"
	| "PHYSICS"
	| "CHEMISTRY"

export type previewSubject = "MATHEMATICS" | "PHYSICS" | "CHEMISTRY"

type topic = keyof typeof topics

export type questionInfo = {
	number: number
	status: questionStatus
	subject: subject
	topic: topic
	examId: number
}

export type section = topic[]

type tab = {
	name: string
	previewName: string
	sections: section[]
}

export type layout = tab[]
