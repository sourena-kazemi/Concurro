import { useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useEffect, useReducer } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"

type answer = {
	number: number
	choice: number
	exam: number
}
type answers = {
	[key: number]: number
}
type reducerAction = { type: "SET_OR_UPDATE"; question: number; choice: number }

function reducer(state: answers, action: reducerAction): answers {
	if (action.type === "SET_OR_UPDATE") {
		return {
			...state,
			[action.question]: action.choice,
		}
	}
	throw Error("Unknown action : " + action.type)
}

export default function AnswerSheet() {
	const { id, size } = useLocalSearchParams<{ id: string; size?: string }>()

	const [answers, dispatch] = useReducer(reducer, {})

	const db = useSQLiteContext()

	const fetchQuestions = async () => {
		const result = await db.getAllAsync<answer>(
			"SELECT * FROM answers WHERE exam = ?",
			id
		)
		const answers: answers = {}
		if (result) {
			result.map((answer) =>
				dispatch({
					type: "SET_OR_UPDATE",
					question: answer.number,
					choice: answer.choice,
				})
			)
		}
	}

	const storeAnswerInDb = async (number: number, choice: number) => {
		const result = await db.runAsync(
			"INSERT INTO answers (number,choice,exam) VALUES (?,?,?) ON CONFLICT (number) DO UPDATE SET choice=excluded.choice,exam=excluded.exam",
			[number, choice, +id]
		)
		dispatch({ type: "SET_OR_UPDATE", question: number, choice: choice })
	}

	useFocusEffect(
		useCallback(() => {
			fetchQuestions()
		}, [])
	)

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="bg-background"
		>
			<View className="flex-1 px-4 py-20 gap-3">
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
										answers[index + 1] === 1
											? "bg-primary/50"
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
										answers[index + 1] === 2
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
										answers[index + 1] === 3
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
										answers[index + 1] === 4
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
