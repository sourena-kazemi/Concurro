import { type questionStatus } from "@/types/types"
import { useState } from "react"
import { Pressable, View } from "react-native"
import StyledText from "../StyledText"
//@ts-ignore
import PN from "persian-number"

type props = {
	statusHandler: React.Dispatch<React.SetStateAction<questionStatus>>
	storeHandler: () => void
	answer: number
}

export default function StatusSelector({
	statusHandler,
	storeHandler,
	answer,
}: props) {
	const [isStatusSelected, setIsStatusSelected] = useState(false)
	const [currentStatus, setCurrentStatus] = useState<questionStatus>()
	return (
		<View className="gap-6">
			{!!answer && (
				<View className="bg-secondary rounded-xl px-4 py-2 w-full flex-row items-center gap-1 my-6">
					<View className="flex-row gap-1">
						<View
							className={`${
								answer === 1
									? "bg-primary/50"
									: "bg-background/50"
							} rounded-xl p-3 grow`}
						>
							<StyledText className="text-text text-center">
								{PN.convertEnToPe(1)}
							</StyledText>
						</View>
						<View
							className={`${
								answer === 2 ? "bg-text/50" : "bg-background/50"
							} rounded-xl p-3 grow`}
						>
							<StyledText className="text-text text-center">
								{PN.convertEnToPe(2)}
							</StyledText>
						</View>
						<View
							className={`${
								answer === 3 ? "bg-text/50" : "bg-background/50"
							} rounded-xl p-3 grow`}
						>
							<StyledText className="text-text text-center">
								{PN.convertEnToPe(3)}
							</StyledText>
						</View>
						<View
							className={`${
								answer === 4 ? "bg-text/50" : "bg-background/50"
							} rounded-xl p-3 grow`}
						>
							<StyledText className="text-text text-center">
								{PN.convertEnToPe(4)}
							</StyledText>
						</View>
					</View>
				</View>
			)}
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
				<StyledText
					className={`text-xl text-right ${
						currentStatus === "CORRECT"
							? "text-background"
							: "text-text"
					}`}
				>
					درست
				</StyledText>
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
				<StyledText
					className={`text-xl text-right ${
						currentStatus === "WRONG"
							? "text-background"
							: "text-text"
					}`}
				>
					نادرست
				</StyledText>
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
				<StyledText
					className={`text-xl text-right ${
						currentStatus === "UNANSWERED"
							? "text-background"
							: "text-text"
					}`}
				>
					نزده
				</StyledText>
			</Pressable>
			<Pressable
				onPress={() => storeHandler()}
				disabled={!isStatusSelected}
				className={`p-3 rounded-xl ${
					isStatusSelected ? "bg-accent" : "bg-text opacity-50"
				}`}
			>
				<StyledText className="text-center text-xl text-background">
					بعدی
				</StyledText>
			</Pressable>
		</View>
	)
}
