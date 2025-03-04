import {
	type subject,
	type examInfo,
	type questionInfo,
	type topic,
} from "@/types/types"
import { mathLayout, physicsLayout, chemistryLayout } from "@/constants/layouts"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"
import AnalyticsBox from "./AnalyticsBox"
import { topics } from "@/constants/topics"

type props = {
	examId: string
}
type exam = {
	[key: number]: string
}
type sortedQuestions = {
	[key: string]: {
		[key: string]: { name: string; id: number; questions: questionInfo[] }
	}
}

export default function AnalyticsViewer({ examId }: props) {
	const db = useSQLiteContext()

	const [exams, setExams] = useState<exam>({})
	const [questions, setQuestions] = useState<questionInfo[]>([])
	const [questionsBySubject, setQuestionsBySubject] =
		useState<sortedQuestions>({})
	const [questionsByTopic, setQuestionsByTopic] = useState<sortedQuestions>(
		{}
	)

	const [currentTab, setCurrentTab] = useState<subject>("CALCULUS")
	const [subjectTopics, setSubjectTopics] = useState<topic[]>([])

	const sortQuestions = (questions: questionInfo[], exams: exam) => {
		const questionsBySubject: sortedQuestions = {}
		const questionsByTopic: sortedQuestions = {}

		const chemistryMemorizationTopics: topic[] = []
		const chemistryCalculationTopics: topic[] = []

		chemistryLayout[0].sections.map((section) =>
			chemistryMemorizationTopics.push(...section)
		)
		chemistryLayout[1].sections.map((section) =>
			chemistryCalculationTopics.push(...section)
		)

		questions.map((question) => {
			const check = (object: {
				[key: string]: {
					name: string
					id: number
					questions: questionInfo[]
				}
			}) => {
				if (!object) {
					object = {}
				}
				if (!object[question.exam]) {
					object[question.exam] = {
						name: exams[question.exam],
						id: question.exam,
						questions: [],
					}
				}
				return object
			}
			questionsBySubject[question.subject] = check(
				questionsBySubject[question.subject]
			)
			questionsBySubject["MATHEMATICS"] = check(
				questionsBySubject["MATHEMATICS"]
			)
			questionsBySubject["CHEMISTRY_MEMO"] = check(
				questionsBySubject["CHEMISTRY_MEMO"]
			)
			questionsBySubject["CHEMISTRY_CALC"] = check(
				questionsBySubject["CHEMISTRY_CALC"]
			)
			questionsByTopic[question.topic] = check(
				questionsByTopic[question.topic]
			)

			questionsBySubject[question.subject][question.exam].questions.push(
				question
			)
			questionsByTopic[question.topic][question.exam].questions.push(
				question
			)

			const subject = question.subject
			if (
				subject === "CALCULUS" ||
				subject === "DISCRETE" ||
				subject === "GEOMETRY" ||
				subject === "STATISTICS"
			) {
				questionsBySubject["MATHEMATICS"][question.exam].questions.push(
					question
				)
			}
			if (question.subject === "CHEMISTRY") {
				if (chemistryMemorizationTopics.includes(question.topic)) {
					questionsBySubject["CHEMISTRY_MEMO"][
						question.exam
					].questions.push(question)
				}
				if (chemistryCalculationTopics.includes(question.topic)) {
					questionsBySubject["CHEMISTRY_CALC"][
						question.exam
					].questions.push(question)
				}
			}
		})
		setQuestionsBySubject(questionsBySubject)
		setQuestionsByTopic(questionsByTopic)
	}

	const fetchExamData = async () => {
		const examResult = await db.getFirstSync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			examId
		)
		const questionsResult = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions WHERE exam = ?",
			examId
		)

		if (examResult) {
			setQuestions(questionsResult)
			setExams({ [examResult.id]: examResult.name })
			sortQuestions(questionsResult, { [examResult.id]: examResult.name })
		}
	}

	const fetchAllExamsData = async () => {
		const examsResult = await db.getAllAsync<examInfo>(
			"SELECT * FROM exams"
		)
		const exams: exam = {}
		examsResult.map((exam) => (exams[exam.id] = exam.name))
		const questionsResult = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions"
		)

		setExams(exams)
		setQuestions(questionsResult)
		sortQuestions(questionsResult, exams)
	}

	useFocusEffect(
		useCallback(() => {
			if (examId !== "*") {
				fetchExamData()
			} else {
				fetchAllExamsData()
			}
		}, [examId])
	)
	useFocusEffect(
		useCallback(() => {
			switch (currentTab) {
				case "CALCULUS":
					setSubjectTopics([
						...mathLayout[0].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
					])
					break
				case "GEOMETRY":
					setSubjectTopics([
						...mathLayout[2].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
					])
					break
				case "DISCRETE":
					setSubjectTopics([
						...mathLayout[1].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
					])
					break
				case "STATISTICS":
					setSubjectTopics([
						...mathLayout[3].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
					])
					break
				case "PHYSICS":
					setSubjectTopics([
						...physicsLayout[0].sections[0],
						...physicsLayout[1].sections[0],
						...physicsLayout[2].sections[0],
					])
					break
				case "CHEMISTRY":
					setSubjectTopics([
						...chemistryLayout[0].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
						...chemistryLayout[1].sections.reduce(
							(array, current) => [...array, ...current],
							[]
						),
					])
					break
			}
			console.log(subjectTopics)
		}, [currentTab])
	)

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View className="w-full gap-6 py-20">
				<AnalyticsBox
					questionsByExam={questionsBySubject["MATHEMATICS"] || {}}
					title="MATHEMATICS"
				/>
				<AnalyticsBox
					questionsByExam={questionsBySubject["PHYSICS"] || {}}
					title="PHYSICS"
				/>
				<AnalyticsBox
					questionsByExam={questionsBySubject["CHEMISTRY"] || {}}
					title="CHEMISTRY"
				/>
				<View className="gap-3 mt-6">
					<View className="flex-row gap-3">
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["CALCULUS"] || {}
							}
							title="CALCULUS"
							variation="SMALL"
							direction="COLUMN"
						/>
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["GEOMETRY"] || {}
							}
							title="GEOMETRY"
							variation="SMALL"
							direction="COLUMN"
						/>
					</View>
					<View className="flex-row gap-3">
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["DISCRETE"] || {}
							}
							title="DISCRETE"
							variation="SMALL"
							direction="COLUMN"
						/>
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["STATISTICS"] || {}
							}
							title="STATISTICS"
							variation="SMALL"
							direction="COLUMN"
						/>
					</View>
				</View>
				<View className="gap-3 mt-6">
					<AnalyticsBox
						questionsByExam={
							questionsBySubject["CHEMISTRY_MEMO"] || {}
						}
						title="CHEMISTRY_MEMO"
						variation="SMALL"
						direction="ROW"
					/>
					<AnalyticsBox
						questionsByExam={
							questionsBySubject["CHEMISTRY_CALC"] || {}
						}
						title="CHEMISTRY_CALC"
						variation="SMALL"
						direction="ROW"
					/>
				</View>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
				>
					<View className="flex-row gap-3 mt-6">
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "CALCULUS"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("CALCULUS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "CALCULUS"
										? "text-primary"
										: "text-text"
								}`}
							>
								CALCULUS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "GEOMETRY"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("GEOMETRY")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "GEOMETRY"
										? "text-primary"
										: "text-text"
								}`}
							>
								GEOMETRY
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "DISCRETE"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("DISCRETE")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "DISCRETE"
										? "text-primary"
										: "text-text"
								}`}
							>
								DISCRETE
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "STATISTICS"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("STATISTICS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "STATISTICS"
										? "text-primary"
										: "text-text"
								}`}
							>
								STATISTICS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "PHYSICS"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("PHYSICS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "PHYSICS"
										? "text-primary"
										: "text-text"
								}`}
							>
								PHYSICS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "CHEMISTRY"
									? "bg-background border-2 border-primary"
									: "bg-secondary"
							}`}
							onPress={() => setCurrentTab("CHEMISTRY")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "CHEMISTRY"
										? "text-primary"
										: "text-text"
								}`}
							>
								CHEMISTRY
							</Text>
						</Pressable>
					</View>
				</ScrollView>
				<View className="gap-3">
					{subjectTopics.map((topic) => (
						<AnalyticsBox
							questionsByExam={questionsByTopic[topic] || {}}
							title={topics[topic]}
							variation="SMALL"
							direction="ROW"
						/>
					))}
				</View>
			</View>
		</ScrollView>
	)
}
