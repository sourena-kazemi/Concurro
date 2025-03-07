import {
	type subject,
	type examInfo,
	type questionInfo,
	type topic,
	type analyticsInfo,
} from "@/types/types"
import { mathLayout, physicsLayout, chemistryLayout } from "@/constants/layouts"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useEffect, useRef, useState } from "react"
import {
	View,
	Text,
	ScrollView,
	Pressable,
	BackHandler,
	Dimensions,
} from "react-native"
import AnalyticsBox from "./AnalyticsBox"
import { topics } from "@/constants/topics"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart } from "react-native-chart-kit"
import Icon from "../icon"
import * as MediaLibrary from "expo-media-library"
import { captureRef } from "react-native-view-shot"
import * as Sharing from "expo-sharing"

type props = {
	examId: string
	title: string
}
type exam = {
	[key: number]: string
}
type sortedQuestions = {
	[key: string]: {
		[key: string]: { name: string; id: number; questions: questionInfo[] }
	}
}

export default function AnalyticsViewer({ examId, title }: props) {
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

	const [analytics, setAnalytics] = useState<analyticsInfo>()
	const scrollRef = useRef(null)
	const [currentYPosition, setCurrentYPosition] = useState(0)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [modalMode, setModalMode] = useState<"SUBJECT" | "TOPIC">("SUBJECT")

	const [permissionResponse, requestPermission] =
		MediaLibrary.usePermissions()
	const screenShotRef = useRef<View>(null)

	const handleShare = async () => {
		if (permissionResponse?.status !== "granted") {
			await requestPermission()
		}
		try {
			const localURI = await captureRef(screenShotRef)
			await Sharing.shareAsync(localURI, { mimeType: "image/gif" })
		} catch (e) {
			console.error(e)
		}
	}

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
		}, [currentTab])
	)
	useEffect(() => {
		if (isModalVisible) {
			// @ts-ignore
			scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
		}
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				if (isModalVisible) {
					setIsModalVisible(false)
					// @ts-ignore
					scrollRef.current?.scrollTo({
						x: 0,
						y: currentYPosition,
						animated: true,
					})
					return true
				}
				return false
			}
		)
		return () => backHandler.remove()
	}, [isModalVisible])

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			ref={scrollRef}
			onScrollEndDrag={(e) => {
				if (!isModalVisible) {
					setCurrentYPosition(e.nativeEvent.contentOffset.y)
				}
			}}
		>
			<View className="w-full gap-6 py-10">
				<View className="mt-6 flex-row justify-between items-center">
					<Text className="text-text text-3xl">{title}</Text>
					<Pressable onPress={() => handleShare()}>
						<Icon name="share" color="#e4ece9" />
					</Pressable>
				</View>
				<View className="gap-6" ref={screenShotRef} collapsable={false}>
					<AnalyticsBox
						modalModeHandler={() => setModalMode("SUBJECT")}
						analyticsHandler={setAnalytics}
						modalVisibilityHandler={setIsModalVisible}
						questionsByExam={
							questionsBySubject["MATHEMATICS"] || {}
						}
						title="MATHEMATICS"
					/>
					<AnalyticsBox
						modalModeHandler={() => setModalMode("SUBJECT")}
						analyticsHandler={setAnalytics}
						modalVisibilityHandler={setIsModalVisible}
						questionsByExam={questionsBySubject["PHYSICS"] || {}}
						title="PHYSICS"
					/>
					<AnalyticsBox
						modalModeHandler={() => setModalMode("SUBJECT")}
						analyticsHandler={setAnalytics}
						modalVisibilityHandler={setIsModalVisible}
						questionsByExam={questionsBySubject["CHEMISTRY"] || {}}
						title="CHEMISTRY"
					/>
					<View className="gap-3 mt-6">
						<View className="flex-row gap-3">
							<AnalyticsBox
								modalModeHandler={() => setModalMode("SUBJECT")}
								analyticsHandler={setAnalytics}
								modalVisibilityHandler={setIsModalVisible}
								questionsByExam={
									questionsBySubject["CALCULUS"] || {}
								}
								title="CALCULUS"
								background="PRIMARY"
								variation="SMALL"
								direction="COLUMN"
							/>
							<AnalyticsBox
								modalModeHandler={() => setModalMode("SUBJECT")}
								analyticsHandler={setAnalytics}
								modalVisibilityHandler={setIsModalVisible}
								questionsByExam={
									questionsBySubject["GEOMETRY"] || {}
								}
								title="GEOMETRY"
								background="PRIMARY"
								variation="SMALL"
								direction="COLUMN"
							/>
						</View>
						<View className="flex-row gap-3">
							<AnalyticsBox
								modalModeHandler={() => setModalMode("SUBJECT")}
								analyticsHandler={setAnalytics}
								modalVisibilityHandler={setIsModalVisible}
								questionsByExam={
									questionsBySubject["DISCRETE"] || {}
								}
								title="DISCRETE"
								background="PRIMARY"
								variation="SMALL"
								direction="COLUMN"
							/>
							<AnalyticsBox
								modalModeHandler={() => setModalMode("SUBJECT")}
								analyticsHandler={setAnalytics}
								modalVisibilityHandler={setIsModalVisible}
								questionsByExam={
									questionsBySubject["STATISTICS"] || {}
								}
								title="STATISTICS"
								background="PRIMARY"
								variation="SMALL"
								direction="COLUMN"
							/>
						</View>
					</View>
					<View className="gap-3 mt-6">
						<AnalyticsBox
							modalModeHandler={() => setModalMode("SUBJECT")}
							analyticsHandler={setAnalytics}
							modalVisibilityHandler={setIsModalVisible}
							questionsByExam={
								questionsBySubject["CHEMISTRY_MEMO"] || {}
							}
							title="CHEMISTRY_MEMO"
							background="PRIMARY"
							variation="SMALL"
							direction="ROW"
						/>
						<AnalyticsBox
							modalModeHandler={() => setModalMode("SUBJECT")}
							analyticsHandler={setAnalytics}
							modalVisibilityHandler={setIsModalVisible}
							questionsByExam={
								questionsBySubject["CHEMISTRY_CALC"] || {}
							}
							title="CHEMISTRY_CALC"
							background="PRIMARY"
							variation="SMALL"
							direction="ROW"
						/>
					</View>
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
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("CALCULUS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "CALCULUS"
										? "text-primary"
										: "text-background"
								}`}
							>
								CALCULUS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "GEOMETRY"
									? "bg-background border-2 border-primary"
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("GEOMETRY")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "GEOMETRY"
										? "text-primary"
										: "text-background"
								}`}
							>
								GEOMETRY
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "DISCRETE"
									? "bg-background border-2 border-primary"
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("DISCRETE")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "DISCRETE"
										? "text-primary"
										: "text-background"
								}`}
							>
								DISCRETE
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "STATISTICS"
									? "bg-background border-2 border-primary"
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("STATISTICS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "STATISTICS"
										? "text-primary"
										: "text-background"
								}`}
							>
								STATISTICS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "PHYSICS"
									? "bg-background border-2 border-primary"
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("PHYSICS")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "PHYSICS"
										? "text-primary"
										: "text-background"
								}`}
							>
								PHYSICS
							</Text>
						</Pressable>
						<Pressable
							className={`rounded-xl grow p-2 ${
								currentTab === "CHEMISTRY"
									? "bg-background border-2 border-primary"
									: "bg-primary"
							}`}
							onPress={() => setCurrentTab("CHEMISTRY")}
						>
							<Text
								className={`text-center text-xl ${
									currentTab === "CHEMISTRY"
										? "text-primary"
										: "text-background"
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
							modalModeHandler={() => setModalMode("TOPIC")}
							analyticsHandler={setAnalytics}
							modalVisibilityHandler={setIsModalVisible}
							key={topic}
							questionsByExam={questionsByTopic[topic] || {}}
							title={topics[topic]}
							background="SECONDARY"
							variation="SMALL"
							direction="ROW"
						/>
					))}
				</View>
			</View>
			<SafeAreaView
				className={`flex-1 size-full absolute bg-background left-0 ${
					isModalVisible ? "top-0" : "top-full"
				}`}
			>
				<View className="py-20 gap-6">
					<View className="rounded-xl p-4 gap-4 bg-secondary">
						<View className="justify-between items-center flex-row ">
							<Text className="text-2xl font-bold text-text">
								{analytics?.title}
							</Text>
							<Text className="text-xl font-bold text-text">
								{analytics?.percentages.length !== 0
									? analytics?.averagePercentage
									: "-"}
								%
							</Text>
						</View>
						<View className="flex-row items-center justify-between gap-4">
							<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
								<Text className="text-text">Correct</Text>
								<Text className="text-accent text-xl">
									{analytics?.correctQuestionsCount}
								</Text>
							</View>
							<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
								<Text className="text-text ">Wrong</Text>
								<Text className="text-error text-xl">
									{analytics?.wrongQuestionsCount}
								</Text>
							</View>
							<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
								<Text className="text-text ">Unanswered</Text>
								<Text className="text-text text-xl">
									{analytics &&
										analytics.questionsCount -
											analytics.correctQuestionsCount -
											analytics.wrongQuestionsCount}
								</Text>
							</View>
						</View>
					</View>
					{analytics && analytics.percentages.length > 1 && (
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							className="mt-6 -mx-4"
						>
							<LineChart
								data={{
									labels: (analytics && [
										...analytics.percentages.map(
											(exam) => `${exam.id}`
										),
									]) || ["error"],
									datasets: [
										{
											data: (analytics &&
												analytics.percentages.map(
													(exam) => exam.percentage
												)) || [0],
										},
									],
								}}
								width={
									Dimensions.get("window").width *
									(analytics.percentages.length / 5)
								}
								height={300}
								yAxisSuffix="%"
								yAxisInterval={10}
								chartConfig={{
									decimalPlaces: 0,
									backgroundGradientFrom: "#1D2025",
									backgroundGradientTo: "#1D2025",
									color: (opacity = 1) =>
										`rgba(49, 211, 154,${opacity})`,
									labelColor: () => "#e4ece9",
								}}
							/>
						</ScrollView>
					)}
					<View className="gap-6">
						{analytics?.reviewQuestions.map(
							(exam) =>
								!!exam.questions.length && (
									<View key={exam.id} className="gap-3">
										{analytics.percentages.length > 1 && (
											<Text className="text-text text-3xl">
												{exam.name}
											</Text>
										)}
										{exam.questions.map((question) => (
											<View
												key={question.number}
												className="flex-row bg-secondary p-4 rounded-xl justify-between items-center"
											>
												<View className="flex-row gap-3">
													<Text className="text-text text-3xl">
														{question.number}
													</Text>
													<Text className="text-text text-xl">
														{modalMode ===
															"SUBJECT" &&
															question.topic}
													</Text>
												</View>
												<Text className="text-background">
													{question.status}
												</Text>
											</View>
										))}
									</View>
								)
						)}
					</View>
				</View>
			</SafeAreaView>
		</ScrollView>
	)
}
