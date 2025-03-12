import { useFocusEffect, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useEffect, useReducer, useRef } from "react"
import { View, ScrollView, Pressable } from "react-native"
import { type answer } from "@/types/types"
import StyledText from "@/components/StyledText"
//@ts-ignore
import PN from "persian-number"

type answers = {
	[key: number]: number
}
type reducerAction =
	| { type: "SET_OR_UPDATE"; question: number; choice: number }
	| { type: "DELETE"; question: number }

function reducer(state: answers, action: reducerAction): answers {
	if (action.type === "SET_OR_UPDATE") {
		return {
			...state,
			[action.question]: action.choice,
		}
	}
	if (action.type === "DELETE") {
		let tempState = state
		delete tempState[action.question]
		return {
			...tempState,
		}
	}
	throw Error("Unknown action")
}

export default function AnswerSheet() {
	const { id, size } = useLocalSearchParams<{ id: string; size?: string }>()

	const [answers, dispatch] = useReducer(reducer, {})
	const optionsRef = useRef(new Map())

	const db = useSQLiteContext()

	const setBackgroundColors = (
		number: number,
		choice: number,
		type: "SET" | "DELETE"
	) => {
		if (type === "DELETE") {
			optionsRef.current.get(number * 10 + choice).setNativeProps({
				style: { backgroundColor: "rgba(29,32,37,0.5)" },
			})
		}
		if (type === "SET") {
			;[1, 2, 3, 4].map((option) =>
				option === choice
					? optionsRef.current
							.get(number * 10 + option)
							.setNativeProps({
								style: {
									backgroundColor: "rgba(150,212,190,0.5)",
								},
							})
					: optionsRef.current
							.get(number * 10 + option)
							.setNativeProps({
								style: {
									backgroundColor: "rgba(29,32,37,0.5)",
								},
							})
			)
		}
	}

	const fetchQuestions = async () => {
		const result = await db.getAllAsync<answer>(
			"SELECT * FROM answers WHERE exam = ?",
			id
		)
		if (result) {
			result.map((answer) => {
				dispatch({
					type: "SET_OR_UPDATE",
					question: answer.number,
					choice: answer.choice,
				})
				setBackgroundColors(answer.number, answer.choice, "SET")
			})
		}
	}

	const storeAnswerInDb = async (number: number, choice: number) => {
		if (answers[number] === choice) {
			const result = await db.runAsync(
				"DELETE FROM answers WHERE number = ?",
				number
			)
			dispatch({ type: "DELETE", question: number })
			setBackgroundColors(number, choice, "DELETE")
		} else {
			const result = await db.runAsync(
				"INSERT INTO answers (number,choice,exam) VALUES (?,?,?) ON CONFLICT (number) DO UPDATE SET choice=excluded.choice,exam=excluded.exam",
				[number, choice, +id]
			)
			dispatch({
				type: "SET_OR_UPDATE",
				question: number,
				choice: choice,
			})
			setBackgroundColors(number, choice, "SET")
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchQuestions()
		}, [])
	)
	useEffect(() => {
		for (const [question, choice] of Object.entries(answers)) {
			setBackgroundColors(+question, choice, "SET")
		}
	}, [answers])

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
							<StyledText className="text-text text-xl">
								{PN.convertEnToPe(index + 1)}
							</StyledText>
							<View className="flex-row gap-1 w-3/4">
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 1)
									}
									className="bg-background/50 rounded-xl p-3 grow"
									ref={(element) =>
										element
											? optionsRef.current.set(
													(index + 1) * 10 + 1,
													element
											  )
											: optionsRef.current.delete(
													(index + 1) * 10 + 1
											  )
									}
								>
									<StyledText className="text-text text-center">
										{PN.convertEnToPe(1)}
									</StyledText>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 2)
									}
									className="bg-background/50 rounded-xl p-3 grow"
									ref={(element) =>
										element
											? optionsRef.current.set(
													(index + 1) * 10 + 2,
													element
											  )
											: optionsRef.current.delete(
													(index + 1) * 10 + 2
											  )
									}
								>
									<StyledText className="text-text text-center">
										{PN.convertEnToPe(2)}
									</StyledText>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 3)
									}
									className="bg-background/50 rounded-xl p-3 grow"
									ref={(element) =>
										element
											? optionsRef.current.set(
													(index + 1) * 10 + 3,
													element
											  )
											: optionsRef.current.delete(
													(index + 1) * 10 + 3
											  )
									}
								>
									<StyledText className="text-text text-center">
										{PN.convertEnToPe(3)}
									</StyledText>
								</Pressable>
								<Pressable
									onPress={() =>
										storeAnswerInDb(index + 1, 4)
									}
									className="bg-background/50 rounded-xl p-3 grow"
									ref={(element) =>
										element
											? optionsRef.current.set(
													(index + 1) * 10 + 4,
													element
											  )
											: optionsRef.current.delete(
													(index + 1) * 10 + 4
											  )
									}
								>
									<StyledText className="text-text text-center">
										{PN.convertEnToPe(4)}
									</StyledText>
								</Pressable>
							</View>
						</View>
					))}
			</View>
		</ScrollView>
	)
}
