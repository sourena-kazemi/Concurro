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
				tabBarActiveTintColor: "blue",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="house"
							color={focused ? color : "#000000"}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="addExam"
				options={{
					title: "Add",
					tabBarIcon: ({ color, focused }) => (
						<Icon name="plus" color={focused ? color : "#000000"} />
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
							color={focused ? color : "#000000"}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
