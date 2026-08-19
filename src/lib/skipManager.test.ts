import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanExpiredSkips, isSkipped, setSkip } from "./skipManager";

describe("skipManager", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers();
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("should set and check skip status", () => {
		const karaokeId = 123;
		setSkip(karaokeId);
		expect(isSkipped(karaokeId)).toBe(true);
	});

	it("should return false for non-skipped id", () => {
		expect(isSkipped(456)).toBe(false);
	});

	it("should expire after 24 hours", () => {
		const karaokeId = 789;

		// 現在時刻を固定 (例: 2026-07-25 10:00:00)
		const now = new Date(2026, 6, 25, 10, 0, 0);
		vi.setSystemTime(now);

		setSkip(karaokeId);
		expect(isSkipped(karaokeId)).toBe(true);

		// 23時間59分59秒経過 (まだ有効)
		vi.setSystemTime(
			new Date(
				now.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000,
			),
		);
		expect(isSkipped(karaokeId)).toBe(true);

		// 24時間0分0秒経過 (期限切れ)
		vi.setSystemTime(new Date(now.getTime() + 24 * 60 * 60 * 1000 + 1000));
		expect(isSkipped(karaokeId)).toBe(false);
	});

	it("should handle invalid JSON gracefully", () => {
		localStorage.setItem("chakkarabeat_skips", "invalid json");

		// setSkip: クラッシュせず、新しいデータをセットできること
		expect(() => setSkip(1)).not.toThrow();
		expect(isSkipped(1)).toBe(true);

		// isSkipped: クラッシュせず false を返すこと
		localStorage.setItem("chakkarabeat_skips", "invalid json");
		expect(isSkipped(1)).toBe(false);

		// cleanExpiredSkips: クラッシュしないこと
		localStorage.setItem("chakkarabeat_skips", "invalid json");
		expect(() => cleanExpiredSkips()).not.toThrow();
	});
});
