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
			className="mt-4 px-3 py-1.5 text-xs font-medium text-amber-500/70 border border-amber-500/20 rounded-full hover:border-red-500/50 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300"
		>
			1日だけ除外
		</button>
	);
}
