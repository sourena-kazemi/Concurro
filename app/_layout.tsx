import { Stack } from "expo-router/stack"
import "../global.css"

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	)
}
