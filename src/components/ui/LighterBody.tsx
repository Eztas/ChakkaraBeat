// src/components/ui/LighterBody.tsx

export function LighterBody() {
	return (
		<div
			className="relative w-2/5 aspect-square rounded-l-md pointer-events-none"
			style={{
				background:
					"linear-gradient(135deg, #1c1c1e 0%, #0a0a0b 60%, #000 100%)",
				boxShadow: "inset 0 0 12px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)",
			}}
		>
			{[
				{ top: "20%", left: "30%" },
				{ top: "20%", left: "65%" },
				{ top: "50%", left: "18%" },
				{ top: "52%", left: "55%" },
				{ top: "80%", left: "35%" },
				{ top: "80%", left: "68%" },
			].map((pos, i) => (
				<div
					key={i}
					className="absolute w-[14%] h-[14%] rounded-full"
					style={{
						top: pos.top,
						left: pos.left,
						transform: "translate(-50%, -50%)",
						background:
							"radial-gradient(circle at 35% 30%, #fde68a, #b45309 70%, #78350f 100%)",
						boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
					}}
				/>
			))}
		</div>
	);
}
