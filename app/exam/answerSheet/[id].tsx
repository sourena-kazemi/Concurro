import { useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"

type answers = {
	[key: number]: { choice: number; exam: number }
}

export default function AnswerSheet() {
	const { id, size } = useLocalSearchParams<{ id: string; size?: string }>()

	const [answers, setAnswers] = useState<answers>({})

	const db = useSQLiteContext()

	const fetchQuestions = async () => {
		const result = await db.getAllAsync<{
			number: number
			choice: number
			exam: number
		}>("SELECT * FROM answers WHERE exam = ?", id)
		const answers: answers = {}
		if (result) {
			result.map(
				(answer) =>
					(answers[answer.number] = {
						choice: answer.choice,
						exam: answer.exam,
					})
			)
			setAnswers(answers)
		}
	}

	const storeAnswerInDb = async (number: number, choice: number) => {
		const result = await db.runAsync(
			"INSERT INTO answers (number,choice,exam) VALUES (?,?,?)",
			number,
			choice,
			+id
		)
		console.log("hello?")
		const examAnswers: answers = answers
		examAnswers[number] = { choice, exam: +id }
		setAnswers(examAnswers)
	}

	useFocusEffect(
		useCallback(() => {
			fetchQuestions()
		}, [])
	)

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="bg-background flex-1 px-4 py-20 gap-3">
				{size &&
					[...Array(+size)].map((_, index) => (
						<View
							className="bg-secondary rounded-xl px-4 py-2 w-full flex-row justify-between items-center gap-1"
							key={index}
						>
							<Text className="text-text text-xl">
								{index + 1}
							</Text>
							<View className="flex-row gap-1 w-3/4">
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 1)
									}
									className={`${
										answers[index + 1] &&
										answers[index + 1].choice === 1
											? "bg-text/50"
											: "bg-background/50"
									} rounded-xl p-3 grow`}
								>
									<Text className="text-text text-center">
										1
									</Text>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 2)
									}
									className={`${
										answers[index + 1] &&
										answers[index + 1].choice === 2
											? "bg-text/50"
											: "bg-background/50"
									} rounded-xl p-3 grow`}
								>
									<Text className="text-text text-center">
										2
									</Text>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 3)
									}
									className={`${
										answers[index + 1] &&
										answers[index + 1].choice === 3
											? "bg-text/50"
											: "bg-background/50"
									} rounded-xl p-3 grow`}
								>
									<Text className="text-text text-center">
										3
									</Text>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 4)
									}
									className={`${
										answers[index + 1] &&
										answers[index + 1].choice === 4
											? "bg-text/50"
											: "bg-background/50"
									} rounded-xl p-3 grow`}
								>
									<Text className="text-text text-center">
										4
									</Text>
								</Pressable>
							</View>
						</View>
					))}
			</View>
		</ScrollView>
	)
}
