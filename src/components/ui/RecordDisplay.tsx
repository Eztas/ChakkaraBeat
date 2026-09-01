// src/components/ui/RecordDisplay.tsx

import { useState } from "react";
import { getAdminToken } from "../../lib/auth";
import { UrlUpdateModal } from "../UrlUpdateModal";
import { SkipButton } from "./SkipButton";
import { UpdateUrlButton } from "./UpdateUrlButton";

export type KaraokeRecord = {
	karaoke_id: number;
	song_id: number;
	song_name: string;
	singer_name: string;
	next: boolean;
	youtube_url?: string | null;
};

type RecordDisplayProps = {
	selectedRecord: KaraokeRecord | null;
	isSpinning: boolean;
	onSkip?: () => void;
};

export function RecordDisplay({
	selectedRecord,
	isSpinning,
	onSkip,
}: RecordDisplayProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	// YouTube IDが11桁であることをチェック
	const isValidYouTubeId = (id?: string | null) => {
		return id && id.length === 11;
	};

	const handleUpdateUrl = async (youtubeId: string) => {
		if (!selectedRecord) return;

		const token = getAdminToken();

		const response = await fetch(`/api/songs/${selectedRecord.song_id}/url`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"X-Admin-Token": token || "",
			},
			body: JSON.stringify({ youtube_url: youtubeId }),
		});

		if (response.ok) {
			alert("更新完了！");
		} else {
			alert("更新失敗");
		}
	};

	const canLink = isValidYouTubeId(selectedRecord?.youtube_url);
	const youtubeUrl = canLink
		? `https://www.youtube.com/watch?v=${selectedRecord?.youtube_url}`
		: undefined;

	// 状態に応じたスタイル選定
	let containerClasses = "";
	let glowColor = "";
	let warpFilter = "";

	if (isSpinning) {
		// 着火操作中 (激しい燃焼)
		containerClasses = "border-amber-500 animate-flame-intense";
		glowColor =
			"bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.22),transparent_75%)]";
		warpFilter = "url(#flame-warp-intense)";
	} else if (selectedRecord) {
		// 着火成功・楽曲表示中 (穏やかな炎)
		containerClasses = "border-orange-500/50 animate-flame-flicker";
		glowColor =
			"bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_75%)]";
		warpFilter = "url(#flame-warp-gentle)";
	} else {
		// 未着火・通常時 (静寂のシアン)
		containerClasses =
			"border-cyan-500/30 shadow-[0_0_20px_-12px_rgba(6,182,212,0.3)]";
		glowColor =
			"bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.12),transparent_70%)]";
	}

	// keyframesを使ったアニメーションを定義し、状態に応じてクラスを適用することで、着火中や楽曲表示中の視覚的な変化を表現
	// SVGのfeTurbulence + feDisplacementMapで外枠自体を炎のように歪ませる（揺らめく輪郭）
	return (
		<div className="relative w-full max-w-[280px] sm:max-w-sm aspect-square">
			{/* SVGフィルター定義（炎の乱流で枠を歪ませる） */}
			<svg width="0" height="0" className="absolute" aria-hidden="true">
				<defs>
					<filter
						id="flame-warp-gentle"
						x="-20%"
						y="-20%"
						width="140%"
						height="140%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.012 0.04"
							numOctaves="2"
							seed="7"
							result="noise"
						>
							<animate
								attributeName="baseFrequency"
								values="0.012 0.04;0.016 0.05;0.010 0.035;0.012 0.04"
								dur="3.6s"
								repeatCount="indefinite"
							/>
						</feTurbulence>
						<feDisplacementMap
							in="SourceGraphic"
							in2="noise"
							scale="6"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
					<filter
						id="flame-warp-intense"
						x="-30%"
						y="-30%"
						width="160%"
						height="160%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.02 0.09"
							numOctaves="3"
							seed="3"
							result="noise2"
						>
							<animate
								attributeName="baseFrequency"
								values="0.02 0.09;0.03 0.12;0.015 0.07;0.02 0.09"
								dur="0.9s"
								repeatCount="indefinite"
							/>
						</feTurbulence>
						<feDisplacementMap
							in="SourceGraphic"
							in2="noise2"
							scale="14"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>

			<div
				style={warpFilter ? { filter: warpFilter } : undefined}
				className={`
          w-full h-full
          bg-[#0f172a]/80 backdrop-blur-md
          rounded-[var(--radius)] border relative
          flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-500
          ${containerClasses}
        `}
			>
				<style>{`
          @keyframes flame-flicker {
            0% {
              box-shadow: 0 0 14px -8px rgba(239, 68, 68, 0.28), 0 0 6px -4px rgba(249, 115, 22, 0.16);
              border-color: rgba(249, 115, 22, 0.35);
              transform: translateY(0) scale(1) skewX(0deg);
            }
            20% {
              box-shadow: 0 0 20px -6px rgba(249, 115, 22, 0.35), 0 0 10px -2px rgba(253, 224, 71, 0.22);
              border-color: rgba(251, 146, 60, 0.42);
              transform: translateY(-0.5px) scale(1.003) skewX(0.15deg);
            }
            40% {
              box-shadow: 0 0 12px -8px rgba(239, 68, 68, 0.22), 0 0 8px -4px rgba(249, 115, 22, 0.18);
              border-color: rgba(239, 68, 68, 0.38);
              transform: translateY(0.5px) scale(0.999) skewX(-0.1deg);
            }
            60% {
              box-shadow: 0 0 24px -5px rgba(251, 146, 60, 0.4), 0 0 12px -2px rgba(253, 224, 71, 0.26);
              border-color: rgba(253, 224, 71, 0.45);
              transform: translateY(-0.3px) scale(1.005) skewX(0.2deg);
            }
            80% {
              box-shadow: 0 0 16px -7px rgba(239, 68, 68, 0.3), 0 0 8px -3px rgba(249, 115, 22, 0.2);
              border-color: rgba(249, 115, 22, 0.4);
              transform: translateY(0.3px) scale(1) skewX(-0.05deg);
            }
            100% {
              box-shadow: 0 0 14px -8px rgba(239, 68, 68, 0.28), 0 0 6px -4px rgba(249, 115, 22, 0.16);
              border-color: rgba(249, 115, 22, 0.35);
              transform: translateY(0) scale(1) skewX(0deg);
            }
          }

          @keyframes flame-intense {
            0% {
              box-shadow: 0 0 22px -4px rgba(239, 68, 68, 0.5), 0 0 10px 0px rgba(251, 146, 60, 0.35);
              border-color: rgba(239, 68, 68, 0.55);
              transform: translateY(0) scale(1) skewX(0deg);
            }
            15% {
              box-shadow: 0 0 30px 0px rgba(253, 224, 71, 0.6), 0 0 16px 2px rgba(239, 68, 68, 0.4);
              border-color: rgba(253, 224, 71, 0.7);
              transform: translateY(-1px) scale(1.01) skewX(0.4deg);
            }
            30% {
              box-shadow: 0 0 18px -6px rgba(239, 68, 68, 0.42), 0 0 8px -2px rgba(251, 146, 60, 0.3);
              border-color: rgba(239, 68, 68, 0.5);
              transform: translateY(0.8px) scale(0.995) skewX(-0.3deg);
            }
            50% {
              box-shadow: 0 0 34px 2px rgba(239, 68, 68, 0.65), 0 0 18px 3px rgba(253, 224, 71, 0.5);
              border-color: rgba(253, 224, 71, 0.75);
              transform: translateY(-0.6px) scale(1.015) skewX(0.5deg);
            }
            65% {
              box-shadow: 0 0 20px -5px rgba(251, 146, 60, 0.45), 0 0 10px -1px rgba(239, 68, 68, 0.32);
              border-color: rgba(251, 146, 60, 0.55);
              transform: translateY(0.5px) scale(1) skewX(-0.25deg);
            }
            85% {
              box-shadow: 0 0 28px 0px rgba(239, 68, 68, 0.55), 0 0 14px 1px rgba(253, 224, 71, 0.4);
              border-color: rgba(239, 68, 68, 0.65);
              transform: translateY(-0.4px) scale(1.008) skewX(0.3deg);
            }
            100% {
              box-shadow: 0 0 22px -4px rgba(239, 68, 68, 0.5), 0 0 10px 0px rgba(251, 146, 60, 0.35);
              border-color: rgba(239, 68, 68, 0.55);
              transform: translateY(0) scale(1) skewX(0deg);
            }
          }

          .animate-flame-flicker {
            animation: flame-flicker 2.4s ease-in-out infinite;
          }

          .animate-flame-intense {
            animation: flame-intense 0.6s ease-in-out infinite;
          }
        `}</style>

				{selectedRecord ? (
					<div
						className={`text-center px-2 transition-all duration-300 ${isSpinning ? "blur-md opacity-50" : "opacity-100"}`}
					>
						{canLink ? (
							<a
								href={youtubeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="block group hover:underline decoration-orange-500/50 underline-offset-4"
							>
								<p className="text-xs sm:text-sm text-amber-400 font-medium mb-1 sm:mb-2 tracking-widest break-all drop-shadow-[0_0_4px_rgba(245,158,11,0.35)] group-hover:text-amber-200 transition-colors">
									{selectedRecord.singer_name}
								</p>
								<h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)] break-all text-orange-100 group-hover:text-white transition-colors">
									{selectedRecord.song_name}
								</h2>
							</a>
						) : (
							<>
								<p className="text-xs sm:text-sm text-amber-400 font-medium mb-1 sm:mb-2 tracking-widest break-all drop-shadow-[0_0_4px_rgba(245,158,11,0.35)]">
									{selectedRecord.singer_name}
								</p>
								<h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)] break-all text-orange-100">
									{selectedRecord.song_name}
								</h2>
							</>
						)}
						<div className="flex gap-2 justify-center">
							<UpdateUrlButton onClick={() => setIsModalOpen(true)} />
						</div>
						<UrlUpdateModal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							onUpdate={handleUpdateUrl}
						/>
						<SkipButton karaokeId={selectedRecord.karaoke_id} onSkip={onSkip} />
					</div>
				) : (
					<p className="text-slate-400 text-center text-sm sm:text-base leading-relaxed">
						次歌う曲を
						<br />
						<span className="text-cyan-400 font-bold">ボタン1つで着火！</span>
					</p>
				)}

				<div
					className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 rounded-[var(--radius)] opacity-30 ${glowColor}`}
				/>
			</div>
		</div>
	);
}
