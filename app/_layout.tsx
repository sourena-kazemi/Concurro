import { Stack } from "expo-router/stack"
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite"
import "../global.css"

export default function RootLayout() {
	const createDBIfNeeded = async (db: SQLiteDatabase) => {
		await db.execAsync(
			`CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY, name TEXT NOT NULL, size INTEGER, status TEXT NOT NULL, mathStart INTEGER, mathEnd INTEGER, physicsStart INTEGER, physicsEnd INTEGER, chemistryStart INTEGER, chemistryEnd INTEGER);
			CREATE TABLE IF NOT EXISTS questions (number INTEGER, status TEXT NOT NULL, subject TEXT NOT NULL, topic TEXT NOT NULL, exam INTEGER);
			`
		)
	}
	return (
		<SQLiteProvider databaseName="database.db" onInit={createDBIfNeeded}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
			</Stack>
		</SQLiteProvider>
	)
}
