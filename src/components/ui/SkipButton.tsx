// src/components/ui/SkipButton.tsx
import { setSkip } from "../../lib/skipManager";

type SkipButtonProps = {
	karaokeId: number;
	onSkip?: () => void;
};

export function SkipButton({ karaokeId, onSkip }: SkipButtonProps) {
	const handleClick = () => {
		setSkip(karaokeId);
		if (onSkip) {
			onSkip();
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="mt-4 text-xs text-slate-500 hover:text-red-400 transition-colors"
		>
			1日だけ除外
		</button>
	);
}
