import { View, TextInput, Pressable, ScrollView } from "react-native"
import { useState } from "react"
import { useSQLiteContext } from "expo-sqlite"
import { router } from "expo-router"
import { examDBInfo } from "@/types/types"
import StyledText from "@/components/StyledText"
//@ts-ignore
import PN from "persian-number"

export default function AddExam() {
	const [name, setName] = useState("")
	const [size, setSize] = useState(0)

	const [mathStart, setMathStart] = useState(0)
	const [mathEnd, setMathEnd] = useState(0)

	const [physicsStart, setPhysicsStart] = useState(0)
	const [physicsEnd, setPhysicsEnd] = useState(0)

	const [chemistryStart, setChemistryStart] = useState(0)
	const [chemistryEnd, setChemistryEnd] = useState(0)

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
			setError("همه فیلد ها باید پر شود !")
			return false
		}
		const numberOfQuestions =
			mathEnd -
			mathStart +
			1 +
			(physicsEnd - physicsStart + 1) +
			(chemistryEnd - chemistryStart + 1)
		if (numberOfQuestions !== size) {
			setError("تعداد سوالات با بازه ها مطابقت ندارد !")
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
			setError("بازه ها اشتراک دارند !")
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
		<ScrollView
			showsVerticalScrollIndicator={false}
			className="bg-background"
		>
			<View className="flex-1 items-center bg-background w-full gap-3 px-4 py-20 ">
				<StyledText className="text-text text-3xl">
					افزودن آزمون
				</StyledText>
				<TextInput
					style={{ fontFamily: "Vazirmatn-Bold" }}
					className="text-background placeholder:text-background/50 bg-primary rounded-xl w-full p-3"
					placeholder="اسم آزمون"
					onChangeText={(newText) => setName(newText)}
				/>
				<StyledText className="text-text text-xl mt-3">
					تعداد سوالات
				</StyledText>
				<TextInput
					style={{ fontFamily: "Vazirmatn-Bold" }}
					className="text-background placeholder:text-background/50 text-right bg-primary rounded-xl w-full p-3"
					placeholder={PN.convertEnToPe(105)}
					keyboardType="numeric"
					onChangeText={(newValue) => setSize(+newValue)}
				></TextInput>

				<StyledText className="text-text text-xl mt-3">
					سوالات ریاضی
				</StyledText>
				<View className="flex flex-row-reverse w-full gap-3">
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-background/50 bg-primary rounded-xl p-3 flex-grow"
						placeholder={`اولین سوال : ${PN.convertEnToPe(1)}`}
						keyboardType="numeric"
						onChangeText={(newValue) => setMathStart(+newValue)}
					></TextInput>
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-background/50 bg-primary rounded-xl p-3 flex-grow"
						placeholder={`آخرین سوال : ${PN.convertEnToPe(40)}`}
						keyboardType="numeric"
						onChangeText={(newValue) => setMathEnd(+newValue)}
					></TextInput>
				</View>

				<StyledText className="text-text text-xl mt-3">
					سوالات فیزیک
				</StyledText>
				<View className="flex flex-row-reverse w-full gap-3">
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-background/50 bg-primary rounded-xl p-3 flex-grow"
						placeholder={`اولین سوال : ${PN.convertEnToPe(41)}`}
						keyboardType="numeric"
						onChangeText={(newValue) => setPhysicsStart(+newValue)}
					></TextInput>
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-background/50 bg-primary rounded-xl p-3 flex-grow"
						placeholder={`آخرین سوال : ${PN.convertEnToPe(75)}`}
						keyboardType="numeric"
						onChangeText={(newValue) => setPhysicsEnd(+newValue)}
					></TextInput>
				</View>

				<StyledText className="text-text text-xl mt-3">
					سوالات شیمی
				</StyledText>
				<View className="flex flex-row-reverse w-full gap-3">
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-[rgba(29,32,37,0.5)] bg-primary rounded-xl p-3 flex-grow"
						placeholder={`اولین سوال : ${PN.convertEnToPe(76)}`}
						keyboardType="numeric"
						onChangeText={(newValue) =>
							setChemistryStart(+newValue)
						}
					></TextInput>
					<TextInput
						style={{ fontFamily: "Vazirmatn-Bold" }}
						className="text-background placeholder:text-[rgba(29,32,37,0.5)] bg-primary rounded-xl p-3 flex-grow"
						placeholder={`آخرین سوال : ${PN.convertEnToPe(105)}`}
						keyboardType="numeric"
						onChangeText={(newValue) => setChemistryEnd(+newValue)}
					></TextInput>
				</View>

				<Pressable
					onPress={() => handleSubmit()}
					className="bg-accent mt-3 p-3 w-full rounded-xl"
				>
					<StyledText className="text-background text-xl text-center">
						ثبت آزمون
					</StyledText>
				</Pressable>

				<StyledText className="text-error text-xl">{error}</StyledText>
			</View>
		</ScrollView>
	)
}
