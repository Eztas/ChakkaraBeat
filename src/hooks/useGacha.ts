// src/hooks/useGacha.ts
import { useMemo, useState } from "react";
import type { KaraokeRecord } from "../components/ui/RecordDisplay";
import type { Spark } from "../components/ui/Sparks";
import { isSkipped } from "../lib/skipManager";

export function useGacha(records: KaraokeRecord[]) {
	const [selectedRecord, setSelectedRecord] = useState<KaraokeRecord | null>(
		null,
	);
	const [isSpinning, setIsSpinning] = useState(false);
	const [sparks, setSparks] = useState<Spark[]>([]);
	const [skipVersion, setSkipVersion] = useState(0);

	// スキップ除外したリストをメモ化 (skipVersionの変化でも再計算)
	const activeRecords = useMemo(() => {
		return records.filter((r) => !isSkipped(r.karaoke_id));
	}, [records, skipVersion]);

	const spinGacha = () => {
		if (isSpinning || activeRecords.length === 0) return;
		setIsSpinning(true);

		const sparkCount = 45;
		const newSparks = Array.from({ length: sparkCount }).map((_, i) => {
			const angle = Math.random() * Math.PI * 2;
			const velocity = 80 + Math.random() * 140;

			const mx = `${Math.cos(angle) * velocity + 40}px`;
			const my = `${Math.sin(angle) * velocity - 40}px`;

			const colors = ["#ffffff", "#fffbeb", "#fef08a", "#f97316", "#ef4444"];
			const color = colors[Math.floor(Math.random() * colors.length)];

			return {
				id: i,
				mx,
				my,
				color,
				size: 3 + Math.random() * 5,
				delay: Math.random() * 0.1,
			};
		});
		setSparks(newSparks);

		setTimeout(() => {
			const record =
				activeRecords[Math.floor(Math.random() * activeRecords.length)];
			setSelectedRecord(record);
			setIsSpinning(false);
			setSparks([]);
		}, 400);
	};

	const notifySkip = () => {
		setSelectedRecord(null);
		setSkipVersion((v) => v + 1);
	};

	return {
		selectedRecord,
		setSelectedRecord,
		isSpinning,
		sparks,
		activeRecords,
		spinGacha,
		notifySkip,
	};
}
