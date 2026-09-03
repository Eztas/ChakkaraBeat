// src/hooks/useGacha.test.ts
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { KaraokeRecord } from "../components/ui/RecordDisplay";
import { setSkip } from "../lib/skipManager";
import { useGacha } from "./useGacha";

const mockRecords: KaraokeRecord[] = [
	{
		karaoke_id: 1,
		song_id: 101,
		song_name: "曲1",
		singer_name: "歌手1",
		next: false,
		youtube_url: null,
	},
	{
		karaoke_id: 2,
		song_id: 102,
		song_name: "曲2",
		singer_name: "歌手2",
		next: false,
		youtube_url: null,
	},
];

describe("useGacha hook", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		localStorage.clear();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("初期状態で全レコードが activeRecords に含まれること", () => {
		const { result } = renderHook(() => useGacha(mockRecords));
		expect(result.current.activeRecords).toHaveLength(2);
		expect(result.current.selectedRecord).toBeNull();
		expect(result.current.isSpinning).toBe(false);
	});

	it("spinGacha 呼び出しで抽選アニメーション後に selectedRecord が設定されること", async () => {
		const { result } = renderHook(() => useGacha(mockRecords));

		act(() => {
			result.current.spinGacha();
		});

		expect(result.current.isSpinning).toBe(true);
		expect(result.current.sparks.length).toBeGreaterThan(0);

		await act(async () => {
			vi.advanceTimersByTime(400);
		});

		expect(result.current.isSpinning).toBe(false);
		expect(result.current.selectedRecord).not.toBeNull();
		expect(mockRecords).toContainEqual(result.current.selectedRecord);
	});

	it("スキップ追加後に notifySkip を呼び出すと activeRecords が更新されること", () => {
		const { result } = renderHook(() => useGacha(mockRecords));
		expect(result.current.activeRecords).toHaveLength(2);

		// karaoke_id 1 をスキップに追加
		setSkip(1);

		act(() => {
			result.current.notifySkip();
		});

		expect(result.current.activeRecords).toHaveLength(1);
		expect(result.current.activeRecords[0].karaoke_id).toBe(2);
		expect(result.current.selectedRecord).toBeNull();
	});
});
