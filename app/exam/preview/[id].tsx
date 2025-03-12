import { View, Pressable } from "react-native"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { type examInfo, type questionInfo } from "@/types/types"
import { useCallback, useState } from "react"
import AnalyticsViewer from "@/components/analytics/AnalyticsViewer"
import StyledText from "@/components/StyledText"
//@ts-ignore
import PN from "persian-number"

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
			<StyledText className="text-text text-3xl">
				{examInfo?.name}
			</StyledText>
			<View className="flex flex-row gap-3">
				<StyledText className="text-text text-xl">
					<StyledText className="text-accent">
						{PN.convertEnToPe(examInfo?.size)}
					</StyledText>
					سوال،{" "}
					<StyledText className="text-accent">
						{PN.convertEnToPe(lastQuestion)}
					</StyledText>{" "}
					ثبت شده
				</StyledText>
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
				<StyledText className="text-background text-center text-xl">
					ثبت سوالات
				</StyledText>
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
				<StyledText className="text-background text-center text-xl">
					پاسخ برگ
				</StyledText>
			</Pressable>
		</View>
	)
}
