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
	let skips: SkipMap = {};
	try {
		skips = rawData ? JSON.parse(rawData) : {};
	} catch (e) {
		console.error("Failed to parse skip data", e);
	}

	// 24時間後にスキップ解除
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	skips[karaokeId] = { expiresAt: expiresAt.getTime() };
	localStorage.setItem(SKIP_STORAGE_KEY, JSON.stringify(skips));
};

export const isSkipped = (karaokeId: number): boolean => {
	const rawData = localStorage.getItem(SKIP_STORAGE_KEY);
	if (!rawData) return false;

	let skips: SkipMap = {};
	try {
		skips = JSON.parse(rawData);
	} catch (e) {
		console.error("Failed to parse skip data", e);
		return false;
	}
	const skip = skips[karaokeId];
	if (!skip) return false;

	return Date.now() <= skip.expiresAt;
};

export const cleanExpiredSkips = () => {
	const rawData = localStorage.getItem(SKIP_STORAGE_KEY);
	if (!rawData) return;

	let skips: SkipMap = {};
	try {
		skips = JSON.parse(rawData);
	} catch (e) {
		console.error("Failed to parse skip data", e);
		return;
	}
	let hasChanged = false;
	const now = Date.now();

	for (const id in skips) {
		if (now > skips[id].expiresAt) {
			delete skips[id];
			hasChanged = true;
		}
	}

	if (hasChanged) {
		localStorage.setItem(SKIP_STORAGE_KEY, JSON.stringify(skips));
	}
};
