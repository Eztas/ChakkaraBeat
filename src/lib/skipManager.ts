// src/lib/skipManager.ts
const SKIP_STORAGE_KEY = "chakkarabeat_skips";

interface SkipData {
	expiresAt: number; // タイムスタンプ
}

interface SkipMap {
	[karaokeId: number]: SkipData;
}

export const setSkip = (karaokeId: number) => {
	const rawData = localStorage.getItem(SKIP_STORAGE_KEY);
	const skips: SkipMap = rawData ? JSON.parse(rawData) : {};

	// 24時間後にスキップ解除
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	skips[karaokeId] = { expiresAt: expiresAt.getTime() };
	localStorage.setItem(SKIP_STORAGE_KEY, JSON.stringify(skips));
};

export const isSkipped = (karaokeId: number): boolean => {
	const rawData = localStorage.getItem(SKIP_STORAGE_KEY);
	if (!rawData) return false;

	const skips: SkipMap = JSON.parse(rawData);
	const skip = skips[karaokeId];
	if (!skip) return false;

	if (Date.now() > skip.expiresAt) {
		// 期限切れなら削除してfalseを返す
		delete skips[karaokeId];
		localStorage.setItem(SKIP_STORAGE_KEY, JSON.stringify(skips));
		return false;
	}
	return true;
};
