// src/components/FilterView.tsx
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import type { AppType } from "../../worker/index";
import { useGacha } from "../hooks/useGacha";
import { cleanExpiredSkips } from "../lib/skipManager";
import AddRecordDrawer from "./AddRecordDrawer";
import { FlintWheel } from "./ui/FlintWheel";
import { LighterBody } from "./ui/LighterBody";
import { type KaraokeRecord, RecordDisplay } from "./ui/RecordDisplay";
import { Sparks } from "./ui/Sparks";

const client = hc<AppType>("/");

export default function FilterView() {
	const [records, setRecords] = useState<KaraokeRecord[]>([]);
	const {
		selectedRecord,
		isSpinning,
		sparks,
		activeRecords,
		spinGacha,
		notifySkip,
	} = useGacha(records);

	useEffect(() => {
		cleanExpiredSkips();
		client.api.karaoke_records
			.$get()
			.then((res) => res.json())
			.then((data) => {
				setRecords(data as KaraokeRecord[]);
			});
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen h-[100dvh] bg-[#020617] text-white p-4 sm:p-6 overflow-hidden select-none">
			<style>{`
        @keyframes spark-burst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--mx), var(--my)) scale(0.1);
            opacity: 0;
          }
        }
        @keyframes flash-glow {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; filter: blur(10px); }
          30% { opacity: 0.8; filter: blur(20px); }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; filter: blur(40px); }
        }
        .animate-spark {
          animation: spark-burst 0.7s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }
        .animate-flash {
          animation: flash-glow 0.4s ease-out forwards;
        }
      `}</style>

			<h1
				className="
        text-3xl sm:text-4xl font-black mb-6 sm:mb-10 tracking-tighter
        bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 
        bg-clip-text text-transparent
        drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]
      "
			>
				ChakkaraBeat
			</h1>

			<RecordDisplay
				selectedRecord={selectedRecord}
				isSpinning={isSpinning}
				onSkip={notifySkip}
			/>

			<div className="mt-6 sm:mt-12 w-full max-w-[280px] sm:max-w-sm flex items-center justify-center gap-2">
				<LighterBody />
				<div className="relative w-3/5 aspect-square">
					<FlintWheel
						onClick={spinGacha}
						disabled={isSpinning || activeRecords.length === 0}
						isSpinning={isSpinning}
					/>
					<Sparks isSpinning={isSpinning} sparks={sparks} />
				</div>
			</div>

			<div className="fixed -bottom-20 -left-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full" />
			<div className="fixed -top-20 -right-20 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
			<AddRecordDrawer />
		</div>
	);
}
