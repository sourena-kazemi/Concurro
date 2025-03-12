import { Pressable, ScrollView, Text, View } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { Link, router, useFocusEffect } from "expo-router"
import { examInfo, examPreview } from "@/types/types"
//@ts-ignore
import PN from "persian-number"

export default function Index() {
	const db = useSQLiteContext()

	const [exams, setExams] = useState<examPreview[]>([])

	const fetchExams = async () => {
		const result = await db.getAllAsync<examInfo>("SELECT * FROM exams")
		const previewInfo: examPreview[] = []
		result.map((exam) =>
			previewInfo.push({
				id: exam.id,
				name: exam.name,
				status:
					exam.status === "CREATED"
						? "جدید"
						: exam.status === "COMPLETED"
						? "تکمیل شده"
						: "در حال تکمیل",
			})
		)
		setExams(previewInfo)
	}

	useFocusEffect(
		useCallback(() => {
			fetchExams()
		}, [])
	)

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="flex-1 flex-col-reverse bg-background w-full px-4 gap-3 justify-end py-20">
				{exams.map((exam) => (
					<Pressable
						onPress={() =>
							router.navigate(`/exam/preview/${exam.id}`)
						}
						className="bg-secondary rounded-xl p-4 w-full flex flex-row-reverse justify-between items-center"
						key={exam.id}
					>
						<View className="flex flex-row-reverse gap-3 items-center">
							<Text className="text-text text-3xl">{`${PN.convertEnToPe(
								exam.id
							)}`}</Text>
							<Text className="text-text text-xl font-bold text-right">{`${exam.name}`}</Text>
						</View>
						<Text className="text-background text-lg font-bold text-right">
							{exam.status}
						</Text>
					</Pressable>
				))}
			</View>
		</ScrollView>
	)
}
