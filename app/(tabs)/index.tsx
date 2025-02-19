import { Text, View } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { Link, useFocusEffect } from "expo-router"
import { examInfo, examPreview } from "@/types/types"

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
				size: exam.size,
				status: exam.status,
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
		<View className="flex-1 justify-center items-center flex-col-reverse">
			{exams.map((exam) => (
				<Link href={`/exam/preview/${exam.id}`} key={exam.id}>
					<View className="border rounded p-2">
						<Text>{`${exam.id} ${exam.name}`}</Text>
						<Text>{exam.size}</Text>
						<Text>{exam.status}</Text>
					</View>
				</Link>
			))}
		</View>
	)
}
