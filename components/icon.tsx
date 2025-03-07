import Svg, { SvgProps, Path, Circle } from "react-native-svg"

type props = {
	name: string
	color: string
	className?: string
}

export default function Icon({ name, color, className }: props) {
	switch (name) {
		case "house":
			return (
				<Svg
					width={24}
					height={24}
					fill="none"
					stroke={color}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					className={className}
				>
					<Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
					<Path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
				</Svg>
			)
		case "chart":
			return (
				<Svg
					width={24}
					height={24}
					fill="none"
					stroke={color}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					className={className}
				>
					<Path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
					<Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
				</Svg>
			)
		case "plus":
			return (
				<Svg
					width={24}
					height={24}
					fill="none"
					stroke={color}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					className={className}
				>
					<Circle cx={12} cy={12} r={10} />
					<Path d="M8 12h8M12 8v8" />
				</Svg>
			)
		case "share":
			return (
				<Svg
					width={24}
					height={24}
					fill="none"
					stroke={color}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					className={className}
				>
					<Circle cx={18} cy={5} r={3} />
					<Circle cx={6} cy={12} r={3} />
					<Circle cx={18} cy={19} r={3} />
					<Path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
				</Svg>
			)
	}
}
