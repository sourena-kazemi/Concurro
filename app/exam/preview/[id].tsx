import { Button, Text, View } from "react-native"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { type examInfo, type questionInfo } from "@/types/types"
import { useCallback, useState } from "react"

export default function Exam() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const db = useSQLiteContext()

	const [examInfo, setExamInfo] = useState<examInfo | null>(null)
	const [lastQuestion, setLastQuestion] = useState(0)

	const fetchExamInfo = async () => {
		const result = await db.getFirstAsync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			id
		)
		setExamInfo(result)
	}
	const fetchExamStatus = async () => {
		const result = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions WHERE exam = ?",
			id
		)
		setLastQuestion(0)
		if (result.length > 0) {
			result.map((question) => {
				if (question.number > lastQuestion) {
					setLastQuestion(question.number)
				}
			})
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchExamInfo()
			fetchExamStatus()
		}, [])
	)

	return (
		<View className="flex-1 justify-center items-center">
			<Text>Exam : {examInfo?.name}</Text>
			<Text>Status : {examInfo?.status}</Text>
			<Text>
				{examInfo?.size} Questions, {lastQuestion} set
			</Text>
			<Button
				title="Update"
				onPress={() =>
					router.navigate(
						`/exam/update/${lastQuestion + 1}?exam=${id}`
					)
				}
			/>
		</View>
	)
}
