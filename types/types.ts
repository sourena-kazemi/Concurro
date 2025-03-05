import { topics } from "@/constants/topics"

export type examStatus = "CREATED" | "IN-PROGRESS" | "COMPLETED"
type examStatusPreview = "CREATED" | "IN-PROGRESS" | "COMPLETED"

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
	| "size"
	| "status"
> & { status: examStatusPreview }

export type questionStatus = "CORRECT" | "WRONG" | "UNANSWERED"

export type subject =
	| "CALCULUS"
	| "GEOMETRY"
	| "DISCRETE"
	| "STATISTICS"
	| "PHYSICS"
	| "CHEMISTRY"

export type previewSubject = "MATHEMATICS" | "PHYSICS" | "CHEMISTRY"

export type topic = keyof typeof topics

export type questionInfo = {
	number: number
	status: questionStatus
	subject: subject
	topic: topic
	exam: number
}

export type section = topic[]

type tab = {
	name: string
	previewName: string
	sections: section[]
}

export type layout = tab[]

export type percentage = {
	name: string
	id: number
	percentage: number
}

export type questions = {
	name: string
	id: number
	questions: questionInfo[]
}

export type analyticsInfo = {
	questionsCount: number
	correctQuestionsCount: number
	wrongQuestionsCount: number
	percentages: percentage[]
	averagePercentage: number
	reviewQuestions: questions[]
}
