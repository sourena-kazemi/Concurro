import { Text, View, Pressable } from "react-native"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { type examInfo, type questionInfo } from "@/types/types"
import { useCallback, useState } from "react"
import AnalyticsViewer from "@/components/analytics/AnalyticsViewer"

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
	const fetchExamQuestions = async () => {
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
			fetchExamQuestions()
		}, [])
	)

	if (examInfo && examInfo.status === "COMPLETED") {
		return (
			<View className="flex-1 w-full bg-background px-4 ">
				<AnalyticsViewer examId={id} title={examInfo.name} />
			</View>
		)
	}
	return (
		<View className="flex-1 justify-center items-center bg-background px-4 gap-6">
			<Text className="text-text text-3xl">{examInfo?.name}</Text>
			<View className="flex flex-row gap-3">
				<Text className="text-text text-xl">
					<Text className="text-accent">{examInfo?.size}</Text>{" "}
					Questions,{" "}
					<Text className="text-accent">{lastQuestion}</Text> set
				</Text>
			</View>
			<Pressable
				onPress={() => {
					router.navigate(
						`/exam/update/${lastQuestion + 1}?exam=${id}`
					)
				}}
				disabled={examInfo?.status === "COMPLETED"}
				className={`rounded-xl p-3 w-full ${
					examInfo?.status === "COMPLETED"
						? "bg-text opacity-50"
						: "bg-accent"
				}`}
			>
				<Text className="text-background text-center text-xl">
					Update
				</Text>
			</Pressable>
			<Pressable
				onPress={() => {
					router.navigate(
						`/exam/answerSheet/${id}?size=${examInfo?.size}`
					)
				}}
				disabled={examInfo?.status === "COMPLETED"}
				className={`rounded-xl p-3 w-full ${
					examInfo?.status === "COMPLETED"
						? "bg-text opacity-50"
						: "bg-accent"
				}`}
			>
				<Text className="text-background text-center text-xl">
					Answer Sheet
				</Text>
			</Pressable>
		</View>
	)
}
