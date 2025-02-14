import { Text, View, TextInput, Button } from "react-native"
import { useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { router } from "expo-router"
import { examDBInfo } from "@/types/types"

export default function AddExam() {
	const [name, setName] = useState("")
	const [size, setSize] = useState(105)

	const [mathStart, setMathStart] = useState(1)
	const [mathEnd, setMathEnd] = useState(40)

	const [physicsStart, setPhysicsStart] = useState(41)
	const [physicsEnd, setPhysicsEnd] = useState(75)

	const [chemistryStart, setChemistryStart] = useState(76)
	const [chemistryEnd, setChemistryEnd] = useState(105)

	const [error, setError] = useState("")

	const db = useSQLiteContext()

	const validate = () => {
		if (
			!name ||
			!size ||
			!mathStart ||
			!mathEnd ||
			!physicsStart ||
			!physicsEnd ||
			!chemistryStart ||
			!chemistryEnd
		) {
			setError("All Fields Must Be Filled !")
			return false
		}
		const numberOfQuestions =
			mathEnd -
			mathStart +
			1 +
			(physicsEnd - physicsStart + 1) +
			(chemistryEnd - chemistryStart + 1)
		if (numberOfQuestions !== size) {
			setError("Wrong Number of Questions !")
			return false
		}
		const mathPhysicsOverlap =
			mathStart <= physicsEnd && physicsStart <= mathEnd
		const mathChemistryOverlap =
			mathStart <= chemistryEnd && chemistryStart <= mathEnd
		const physicsChemistryOverlap =
			physicsStart <= chemistryEnd && chemistryStart <= physicsEnd

		if (
			mathPhysicsOverlap ||
			mathChemistryOverlap ||
			physicsChemistryOverlap
		) {
			setError("Ranges Overlap !")
			return false
		}

		setError("")
		return true
	}

	const storeExamData = async () => {
		const examData: examDBInfo = {
			name,
			size,
			status: "CREATED",
			mathStart,
			mathEnd,
			physicsStart,
			physicsEnd,
			chemistryStart,
			chemistryEnd,
		}

		const result = await db.runAsync(
			`INSERT INTO exams (name, size, status, mathStart, mathEnd, physicsStart, physicsEnd, chemistryStart, chemistryEnd) VALUES (?,?,?,?,?,?,?,?,?)`,
			Object.values(examData)
		)
	}

	const handleSubmit = async () => {
		if (validate()) {
			storeExamData()
			router.replace("/(tabs)")
		}
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Add Exam</Text>
			<TextInput
				placeholder="Name of the exam"
				onChangeText={(newText) => setName(newText)}
			/>
			<Text>Number of questions</Text>
			<TextInput
				placeholder="105"
				defaultValue="105"
				keyboardType="numeric"
				onChangeText={(newValue) => setSize(+newValue)}
			></TextInput>

			<Text>Mathematics Range</Text>
			<TextInput
				placeholder="1"
				defaultValue="1"
				keyboardType="numeric"
				onChangeText={(newValue) => setMathStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="40"
				defaultValue="40"
				keyboardType="numeric"
				onChangeText={(newValue) => setMathEnd(+newValue)}
			></TextInput>

			<Text>Physics Range</Text>
			<TextInput
				placeholder="41"
				defaultValue="41"
				keyboardType="numeric"
				onChangeText={(newValue) => setPhysicsStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="75"
				defaultValue="75"
				keyboardType="numeric"
				onChangeText={(newValue) => setPhysicsEnd(+newValue)}
			></TextInput>

			<Text>Chemistry Range</Text>
			<TextInput
				placeholder="76"
				defaultValue="76"
				keyboardType="numeric"
				onChangeText={(newValue) => setChemistryStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="105"
				defaultValue="105"
				keyboardType="numeric"
				onChangeText={(newValue) => setChemistryEnd(+newValue)}
			></TextInput>

			<Button title="Submit" onPress={() => handleSubmit()} />

			<Text className="text-red-600">{error}</Text>
		</View>
	)
}
