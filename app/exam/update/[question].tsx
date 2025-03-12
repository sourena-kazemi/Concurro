import { ScrollView, View } from "react-native"
import { useFocusEffect, useLocalSearchParams, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import {
	type previewSubject,
	type subject,
	type examInfo,
	type questionInfo,
	answer,
} from "@/types/types"
import { useCallback, useState } from "react"
import MathPanel from "@/components/panels /MathPanel"
import PhysicsPanel from "@/components/panels /PhysicsPanel"
import ChemistryPanel from "@/components/panels /ChemistryPanel"
import StyledText from "@/components/StyledText"
//@ts-ignore
import PN from "persian-number"

export default function Exam() {
	const { question, exam } = useLocalSearchParams<{
		question: string
		exam: string
	}>()

	const db = useSQLiteContext()

	const [examInfo, setExamInfo] = useState<examInfo | null>(null)
	const [previewSubject, setPreviewSubject] = useState<previewSubject>()
	const [answer, setAnswer] = useState(0)

	const storeQuestionInDB = async (questionData: questionInfo) => {
		const nextQuestionNumber = +question + 1
		const result = await db.runAsync(
			"INSERT INTO questions (number, status, subject, topic, exam) VALUES (?,?,?,?,?)",
			Object.values(questionData)
		)
		if (examInfo && examInfo.status === "CREATED") {
			await db.runAsync(
				"UPDATE exams SET status = ? WHERE id = ?",
				"IN-PROGRESS",
				exam
			)
		}
		if (examInfo && nextQuestionNumber > examInfo.size) {
			await db.runAsync(
				"UPDATE exams SET status = ? WHERE id = ?",
				"COMPLETED",
				exam
			)
			router.replace(`/exam/preview/${exam}`)
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
	const fetchAnswer = async () => {
		const result = await db.getFirstAsync<answer>(
			"SELECT * FROM answers WHERE exam = ? AND number = ?",
			[exam, question]
		)
		if (result) {
			setAnswer(result.choice)
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchExamInfo()
			fetchAnswer()
		}, [])
	)
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="bg-background"
		>
			<View className="px-4 py-20 justify-center items-center gap-6">
				<StyledText className="text-text text-6xl">
					{PN.convertEnToPe(question)}
				</StyledText>
				<StyledText className="text-text text-2xl">
					{previewSubject === "MATHEMATICS"
						? "ریاضیات"
						: previewSubject === "PHYSICS"
						? "فیزیک"
						: "شیمی"}
				</StyledText>
				{previewSubject === "MATHEMATICS" && (
					<MathPanel
						storeHandler={storeQuestionInDB}
						questionNumber={question}
						examId={exam}
						answer={answer}
					/>
				)}
				{previewSubject === "PHYSICS" && (
					<PhysicsPanel
						storeHandler={storeQuestionInDB}
						questionNumber={question}
						examId={exam}
						answer={answer}
					/>
				)}
				{previewSubject === "CHEMISTRY" && (
					<ChemistryPanel
						storeHandler={storeQuestionInDB}
						questionNumber={question}
						examId={exam}
						answer={answer}
					/>
				)}
			</View>
		</ScrollView>
	)
}
