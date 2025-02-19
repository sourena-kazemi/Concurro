import { mathLayout } from "@/constants/layouts"
import { useState } from "react"
import TabBar from "./TabBar"

export default function mathPanel() {
	const [currentTab, setCurrentTab] = useState("calculus")

	return <TabBar layout={mathLayout} tabHandler={setCurrentTab} />
}
