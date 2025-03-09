import { Stack } from "expo-router/stack"
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite"
import { StatusBar } from "expo-status-bar"
import * as NavigationBar from "expo-navigation-bar"
import "../global.css"

export default function RootLayout() {
	const createDBIfNeeded = async (db: SQLiteDatabase) => {
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY, name TEXT NOT NULL, size INTEGER, status TEXT NOT NULL, mathStart INTEGER, mathEnd INTEGER, physicsStart INTEGER, physicsEnd INTEGER, chemistryStart INTEGER, chemistryEnd INTEGER);
			CREATE TABLE IF NOT EXISTS questions (number INTEGER, status TEXT NOT NULL, subject TEXT NOT NULL, topic TEXT NOT NULL, exam INTEGER);
			DROP TABLE answers;
			CREATE TABLE IF NOT EXISTS answers (number INTEGER PRIMARY KEY, choice INTEGER, exam INTEGER);
			`
		)
	}

	NavigationBar.setBackgroundColorAsync("#1D2025")

	return (
		<SQLiteProvider databaseName="database.db" onInit={createDBIfNeeded}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="(tabs)" />
			</Stack>
			<StatusBar backgroundColor="#1D2025" />
		</SQLiteProvider>
	)
}
