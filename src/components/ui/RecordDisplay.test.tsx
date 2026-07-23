import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecordDisplay } from "./RecordDisplay";

describe("RecordDisplay", () => {
	it("未着火（通常）状態が正しく表示されること", () => {
		render(<RecordDisplay selectedRecord={null} isSpinning={false} />);
		expect(screen.getByText(/次歌う曲を/)).toBeDefined();
		expect(screen.getByText(/ボタン1つで着火！/)).toBeDefined();
	});

	it("楽曲選択時（着火成功）の表示が正しくされること", () => {
		const record = {
			karaoke_id: 1,
			song_name: "Test Song",
			singer_name: "Test Singer",
			next: false,
		};
		render(<RecordDisplay selectedRecord={record} isSpinning={false} />);
		expect(screen.getByText("Test Song")).toBeDefined();
		expect(screen.getByText("Test Singer")).toBeDefined();
	});

	it("YouTube URLが有効な場合にリンクが表示されること", () => {
		const record = {
			karaoke_id: 1,
			song_name: "Test Song",
			singer_name: "Test Singer",
			next: false,
			youtube_url: "12345678901", // 11桁
		};
		render(<RecordDisplay selectedRecord={record} isSpinning={false} />);
		const link = screen.getByRole("link");
		expect(link.getAttribute("href")).toBe(
			"https://www.youtube.com/watch?v=12345678901",
		);
	});

	it("YouTube URLが無効な場合にリンクが表示されないこと", () => {
		const record = {
			karaoke_id: 1,
			song_name: "Test Song",
			singer_name: "Test Singer",
			next: false,
			youtube_url: "invalid", // 11桁未満
		};
		render(<RecordDisplay selectedRecord={record} isSpinning={false} />);
		expect(screen.queryByRole("link")).toBeNull();
	});

	it("回転中（isSpinning: true）の場合、ブラーがかかっていることを確認する（CSSクラスを確認）", () => {
		const record = {
			karaoke_id: 1,
			song_name: "Test Song",
			singer_name: "Test Singer",
			next: false,
		};
		const { container } = render(
			<RecordDisplay selectedRecord={record} isSpinning={true} />,
		);
		// テキストを含むラッパーdivがblurクラスを持っているか確認
		const textWrapper = container.querySelector(".blur-md");
		expect(textWrapper).not.toBeNull();
	});
});
