import { describe, expect, it } from "vitest";
import { extractYoutubeId } from "./utils";

describe("extractYoutubeId", () => {
	it("IDのみの場合はそのまま返す", () => {
		expect(extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
	});

	it("URLからIDを抽出できる (watch?v=)", () => {
		expect(
			extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
		).toBe("dQw4w9WgXcQ");
	});

	it("短縮URLからIDを抽出できる (youtu.be/)", () => {
		expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe(
			"dQw4w9WgXcQ",
		);
	});

	it("マッチしない場合は元の文字列を返す", () => {
		expect(extractYoutubeId("invalid-url")).toBe("invalid-url");
	});
});
