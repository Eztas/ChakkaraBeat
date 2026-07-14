// lib/auth.ts
// 登録機能のトークン取得
export const getAdminToken = (): string | null => {
	if (typeof window === "undefined") return null;

	const url = new URL(window.location.href);
	return url.searchParams.get("admin");
};
