import { Text, View, TextInput } from "react-native"
import { useState } from "react"
export default function AddExam() {
	const [name, setName] = useState("")
	const [size, setSize] = useState(0)

	const [mathStart, setMathStart] = useState(0)
	const [mathEnd, setMathEnd] = useState(0)

	const [physicsStart, setPhysicsStart] = useState(0)
	const [physicsEnd, setPhysicsEnd] = useState(0)

	const [chemistryStart, setChemistryStart] = useState(0)
	const [chemistryEnd, setChemistryEnd] = useState(0)
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
				placeholder="100"
				keyboardType="numeric"
				onChangeText={(newValue) => setSize(+newValue)}
			></TextInput>

			<Text>Mathematics Range</Text>
			<TextInput
				placeholder="0"
				keyboardType="numeric"
				onChangeText={(newValue) => setMathStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="40"
				keyboardType="numeric"
				onChangeText={(newValue) => setMathEnd(+newValue)}
			></TextInput>

			<Text>Physics Range</Text>
			<TextInput
				placeholder="0"
				keyboardType="numeric"
				onChangeText={(newValue) => setPhysicsStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="40"
				keyboardType="numeric"
				onChangeText={(newValue) => setPhysicsEnd(+newValue)}
			></TextInput>

			<Text>Chemistry Range</Text>
			<TextInput
				placeholder="0"
				keyboardType="numeric"
				onChangeText={(newValue) => setChemistryStart(+newValue)}
			></TextInput>
			<TextInput
				placeholder="40"
				keyboardType="numeric"
				onChangeText={(newValue) => setChemistryEnd(+newValue)}
			></TextInput>
		</View>
	)
}
