import { Pressable, ScrollView, View } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { router, useFocusEffect } from "expo-router"
import { examInfo, examPreview } from "@/types/types"
import StyledText from "@/components/StyledText"
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
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="bg-background"
		>
			<View className="flex-1 flex-col-reverse w-full px-4 gap-3 justify-end py-20">
				{exams.map((exam) => (
					<Pressable
						onPress={() =>
							router.navigate(`/exam/preview/${exam.id}`)
						}
						className="bg-secondary rounded-xl p-4 w-full flex flex-row-reverse justify-between items-center content-center"
						key={exam.id}
					>
						<View className="flex flex-row-reverse gap-3 items-center content-center">
							<StyledText className="text-text text-3xl items-center self-center justify-self-center">{`${PN.convertEnToPe(
								exam.id
							)}`}</StyledText>
							<StyledText className="text-text text-xl font-bold text-right">{`${exam.name}`}</StyledText>
						</View>
						<StyledText className="text-background text-lg font-bold text-right">
							{exam.status}
						</StyledText>
					</Pressable>
				))}
			</View>
		</ScrollView>
	)
}
