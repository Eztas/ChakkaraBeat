import { beforeEach, describe, expect, it, vi } from "vitest";
import { isSkipped, setSkip } from "./skipManager";

describe("skipManager", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers();
	});

	it("should set and check skip status", () => {
		const karaokeId = 123;
		setSkip(karaokeId);
		expect(isSkipped(karaokeId)).toBe(true);
	});

	it("should return false for non-skipped id", () => {
		expect(isSkipped(456)).toBe(false);
	});

	it("should expire after 24 hours (next day 0:00)", () => {
		const karaokeId = 789;

		// 現在時刻を固定 (例: 2026-07-25 10:00:00)
		const now = new Date(2026, 6, 25, 10, 0, 0);
		vi.setSystemTime(now);

		setSkip(karaokeId);
		expect(isSkipped(karaokeId)).toBe(true);

		// 翌日 0:00:01 に移動
		const nextDay = new Date(2026, 6, 26, 0, 0, 1);
		vi.setSystemTime(nextDay);

		expect(isSkipped(karaokeId)).toBe(false);
	});
});
