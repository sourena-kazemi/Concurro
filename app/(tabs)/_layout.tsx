import { Image, StyleSheet, View } from "react-native"
import { Tabs } from "expo-router"
import { SymbolView } from "expo-symbols"

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: () => (
						<Image
							source={require("../../assets/images/house.svg")}
							style={styles.tabIcon}
						></Image>
					),
				}}
			/>
			<Tabs.Screen
				name="analytics"
				options={{
					tabBarIcon: () => (
						<Image
							source={require("../../assets/images/chart-pie.svg")}
							style={styles.tabIcon}
						></Image>
					),
				}}
			/>
		</Tabs>
	)
}

const styles = StyleSheet.create({
	tabIcon: {
		width: 50,
		height: 50,
	},
	tabBar: {
		backgroundColor: "red",
	},
})
