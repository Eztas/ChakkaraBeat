import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractYoutubeId = (input: string): string => {
  const trimmed = input.trim();

  // すでに11文字のIDはそのまま返す
  if (trimmed.length === 11) {
    return trimmed;
  }

  // URLからIDを抽出するための正規表現
  // URL直接: youtube.com/watch?v=xxx
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // 共有では短縮:youtu.be/xxx
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  return trimmed; // どちらにもマッチしない場合は元の文字列を返す
};
