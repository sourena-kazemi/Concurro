import { Image, StyleSheet, View } from "react-native"
import { Tabs } from "expo-router"
import { SymbolView } from "expo-symbols"
import { SQLiteProvider } from "expo-sqlite"
import Icon from "@/components/icon"

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				tabBarLabelPosition: "beside-icon",
				tabBarActiveTintColor: "#31d39a",
				tabBarStyle: {
					backgroundColor: "#1D2025",
					borderTopWidth: 0,
				},
				animation: "shift",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="house"
							color={focused ? color : "#e4ece9"}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="addExam"
				options={{
					title: "Add",
					tabBarIcon: ({ color, focused }) => (
						<Icon name="plus" color={focused ? color : "#e4ece9"} />
					),
				}}
			/>
			<Tabs.Screen
				name="analytics"
				options={{
					title: "Analytics",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="chart"
							color={focused ? color : "#e4ece9"}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
