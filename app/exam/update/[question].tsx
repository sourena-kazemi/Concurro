import { Button, Text, View } from "react-native"
import { useFocusEffect, useLocalSearchParams, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import {
	type previewSubject,
	type subject,
	type examInfo,
	type questionInfo,
} from "@/types/types"
import { useCallback, useState } from "react"
import MathPanel from "@/components/panels /MathPanel"
import PhysicsPanel from "@/components/panels /PhysicsPanel"
import ChemistryPanel from "@/components/panels /ChemistryPanel"

export default function Exam() {
	const { question, exam } = useLocalSearchParams<{
		question: string
		exam: string
	}>()

	const db = useSQLiteContext()

	const [examInfo, setExamInfo] = useState<examInfo | null>(null)
	const [previewSubject, setPreviewSubject] = useState<previewSubject>()

	const storeQuestionInDB = async (questionData: questionInfo) => {
		const nextQuestionNumber = +question + 1
		const result = await db.runAsync(
			"INSERT INTO questions (number, status, subject, topic, exam) VALUES (?,?,?,?,?)",
			Object.values(questionData)
		)
		if (examInfo && nextQuestionNumber > examInfo?.size) {
			router.replace("/")
		} else {
			router.replace(`/exam/update/${nextQuestionNumber}?exam=${exam}`)
		}
	}

	const determineSubject = async (result: examInfo | null) => {
		const questionNumber = +question
		if (result) {
			if (
				questionNumber >= result.mathStart &&
				questionNumber <= result.mathEnd
			) {
				setPreviewSubject("MATHEMATICS")
			}
			if (
				questionNumber >= result.physicsStart &&
				questionNumber <= result.physicsEnd
			) {
				setPreviewSubject("PHYSICS")
			}
			if (
				questionNumber >= result.chemistryStart &&
				questionNumber <= result.chemistryEnd
			) {
				setPreviewSubject("CHEMISTRY")
			}
		}
	}

	const fetchExamInfo = async () => {
		const result = await db.getFirstAsync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			exam
		)
		setExamInfo(result)
		determineSubject(result)
	}

	useFocusEffect(
		useCallback(() => {
			fetchExamInfo()
		}, [])
	)
	return (
		<View className="flex-1 justify-center items-center">
			<Text>Question {question}</Text>
			<Text>{previewSubject}</Text>
			{previewSubject === "MATHEMATICS" && (
				<MathPanel
					storeHandler={storeQuestionInDB}
					questionNumber={question}
					examId={exam}
				/>
			)}
			{previewSubject === "PHYSICS" && (
				<PhysicsPanel
					storeHandler={storeQuestionInDB}
					questionNumber={question}
					examId={exam}
				/>
			)}
			{previewSubject === "CHEMISTRY" && (
				<ChemistryPanel
					storeHandler={storeQuestionInDB}
					questionNumber={question}
					examId={exam}
				/>
			)}
		</View>
	)
}
