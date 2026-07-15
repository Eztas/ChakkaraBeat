// src/components/ui/FlintWheel.tsx

type FlintWheelProps = {
	onClick: () => void;
	disabled: boolean;
	isSpinning: boolean;
};

export function FlintWheel({ onClick, disabled, isSpinning }: FlintWheelProps) {
	const teethCount = 36;
	const teeth = Array.from({ length: teethCount }).map((_, i) => {
		const angle = (360 / teethCount) * i;
		return (
			<rect
				key={`teeth-${angle}`}
				x="47"
				y="4"
				width="6"
				height="9"
				rx="1"
				fill="#3f3f46"
				stroke="#18181b"
				strokeWidth="0.6"
				transform={`rotate(${angle} 50 50)`}
			/>
		);
	});

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        w-full aspect-square flex items-center justify-center
        bg-transparent border-none outline-none rounded-full
        disabled:opacity-70 disabled:cursor-not-allowed
        active:scale-95 transition-transform
        ${isSpinning ? "animate-spin" : ""}
      `}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				style={{ transformOrigin: "center center", animationDuration: "0.4s" }}
			>
				<title>FlintWheel</title>
				<defs>
					<radialGradient id="wheelBody" cx="35%" cy="30%" r="75%">
						<stop offset="0%" stopColor="#52525b" />
						<stop offset="55%" stopColor="#27272a" />
						<stop offset="100%" stopColor="#09090b" />
					</radialGradient>
					<radialGradient id="hubGradient" cx="35%" cy="30%" r="75%">
						<stop offset="0%" stopColor="#fef3c7" />
						<stop offset="45%" stopColor="#d97706" />
						<stop offset="100%" stopColor="#78350f" />
					</radialGradient>
				</defs>

				{teeth}

				<circle
					cx="50"
					cy="50"
					r="38"
					fill="url(#wheelBody)"
					stroke="#000"
					strokeWidth="1.5"
				/>

				{Array.from({ length: 24 }).map((_, i) => {
					const angle = (360 / 24) * i;
					return (
						<line
							key={`line-${angle}`}
							x1="50"
							y1="16"
							x2="50"
							y2="24"
							stroke="#000"
							strokeWidth="0.8"
							opacity="0.5"
							transform={`rotate(${angle} 50 50)`}
						/>
					);
				})}

				<circle
					cx="50"
					cy="50"
					r="13"
					fill="url(#hubGradient)"
					stroke="#451a03"
					strokeWidth="1"
				/>
				<circle cx="50" cy="50" r="4" fill="#451a03" opacity="0.6" />
			</svg>
		</button>
	);
}
