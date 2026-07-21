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
});
