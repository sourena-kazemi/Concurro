import { type questionStatus } from "@/types/types"
import { useState } from "react"
import { Pressable, View, Text, Button } from "react-native"

type props = {
	statusHandler: React.Dispatch<React.SetStateAction<questionStatus>>
	storeHandler: () => void
}

export default function StatusSelector({ statusHandler, storeHandler }: props) {
	const [isStatusSelected, setIsStatusSelected] = useState(false)
	const [currentStatus, setCurrentStatus] = useState<questionStatus>()
	return (
		<View className="gap-6">
			<Pressable
				className={`rounded-xl p-4 ${
					currentStatus === "CORRECT" ? "bg-primary" : "bg-secondary"
				}`}
				onPress={() => {
					statusHandler("CORRECT")
					setCurrentStatus("CORRECT")
					setIsStatusSelected(true)
				}}
			>
				<Text
					className={`text-xl ${
						currentStatus === "CORRECT"
							? "text-background"
							: "text-text"
					}`}
				>
					Correct
				</Text>
			</Pressable>
			<Pressable
				className={`rounded-xl p-4 ${
					currentStatus === "WRONG" ? "bg-primary" : "bg-secondary"
				}`}
				onPress={() => {
					statusHandler("WRONG")
					setCurrentStatus("WRONG")
					setIsStatusSelected(true)
				}}
			>
				<Text
					className={`text-xl ${
						currentStatus === "WRONG"
							? "text-background"
							: "text-text"
					}`}
				>
					Wrong
				</Text>
			</Pressable>
			<Pressable
				className={`rounded-xl p-4 ${
					currentStatus === "UNANSWERED"
						? "bg-primary"
						: "bg-secondary"
				}`}
				onPress={() => {
					statusHandler("UNANSWERED")
					setCurrentStatus("UNANSWERED")
					setIsStatusSelected(true)
				}}
			>
				<Text
					className={`text-xl ${
						currentStatus === "UNANSWERED"
							? "text-background"
							: "text-text"
					}`}
				>
					Unanswered
				</Text>
			</Pressable>
			<Pressable
				onPress={() => storeHandler()}
				disabled={!isStatusSelected}
				className={`p-3 rounded-xl ${
					isStatusSelected ? "bg-accent" : "bg-text opacity-50"
				}`}
			>
				<Text className="text-center text-xl text-text">Next</Text>
			</Pressable>
		</View>
	)
}
