import { questionStatus } from "@/types/types"
import { useState } from "react"
import { Pressable, View, Text, Button } from "react-native"

type props = {
	statusHandler: React.Dispatch<React.SetStateAction<questionStatus>>
	storeHandler: () => void
}

export default function StatusSelector({ statusHandler, storeHandler }: props) {
	const [isStatusSelected, setIsStatusSelected] = useState(false)
	return (
		<View>
			<Pressable
				onPress={() => {
					statusHandler("CORRECT")
					setIsStatusSelected(true)
				}}
			>
				<Text>Correct</Text>
			</Pressable>
			<Pressable
				onPress={() => {
					statusHandler("WRONG")
					setIsStatusSelected(true)
				}}
			>
				<Text>Wrong</Text>
			</Pressable>
			<Pressable
				onPress={() => {
					statusHandler("UNANSWERED")
					setIsStatusSelected(true)
				}}
			>
				<Text>Unanswered</Text>
			</Pressable>
			<Button
				title="Next"
				onPress={() => storeHandler()}
				disabled={!isStatusSelected}
			/>
		</View>
	)
}
