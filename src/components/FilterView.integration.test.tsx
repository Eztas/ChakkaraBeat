import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FilterView from "./FilterView";

// Hono Clientのモック
vi.mock("hono/client", () => ({
	hc: () => ({
		api: {
			karaoke_records: {
				$get: vi.fn().mockResolvedValue({
					json: vi.fn().mockResolvedValue([
						{
							karaoke_id: 1,
							song_id: 10,
							song_name: "曲A",
							singer_name: "歌手A",
							next: false,
							youtube_url: null,
						},
						{
							karaoke_id: 2,
							song_id: 20,
							song_name: "曲B",
							singer_name: "歌手B",
							next: false,
							youtube_url: null,
						},
					]),
				}),
			},
		},
	}),
}));

describe("FilterView 結合テスト", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("1日だけ除外（スキップ）を押すと、リロードなしでもその後のガチャでスキップされた曲が選ばれなくなること", async () => {
		render(<FilterView />);

		// 初期ロードのAPIレスポンス完了を待つ
		await act(async () => {
			await vi.runAllTimersAsync();
		});

		expect(screen.getByText("ChakkaraBeat")).toBeInTheDocument();

		// ガチャを回す (FlintWheelコンポーネント)
		const wheelElement = screen.getByRole("button", { name: "chakka" });
		fireEvent.click(wheelElement);

		// ガチャのアニメーションタイマー（400ms）を進める
		await act(async () => {
			await vi.advanceTimersByTimeAsync(500);
		});

		// 曲が表示されたことを確認
		const skipButton = screen.getByRole("button", { name: "1日だけ除外" });
		expect(skipButton).toBeInTheDocument();

		// 表示されている曲名を取得
		const firstSelectedSong = screen.getByRole("heading", {
			level: 2,
		}).textContent;
		expect(["曲A", "曲B"]).toContain(firstSelectedSong);

		// 「1日だけ除外」をクリック
		fireEvent.click(skipButton);

		// 表示が未着火状態に戻ることを確認
		expect(screen.getByText("次歌う曲を")).toBeInTheDocument();

		// 再度ガチャを回す
		fireEvent.click(wheelElement);
		await act(async () => {
			await vi.advanceTimersByTimeAsync(500);
		});

		// 2回目の抽選結果を取得
		const secondSelectedSong = screen.getByRole("heading", {
			level: 2,
		}).textContent;

		// 1回目にスキップした曲とは異なるもう一方の曲が選ばれていることを検証
		expect(secondSelectedSong).not.toBe(firstSelectedSong);
	});
});
