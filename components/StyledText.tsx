import { Text, type TextProps } from "react-native"

export default function StyledText({ className, ...rest }: TextProps) {
	return (
		<Text
			className={className}
			style={{ fontFamily: "Vazirmatn-Bold" }}
			{...rest}
		/>
	)
}
