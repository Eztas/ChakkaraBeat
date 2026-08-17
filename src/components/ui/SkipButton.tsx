// src/components/ui/SkipButton.tsx
import { setSkip } from "../../lib/skipManager";
import { ActionButton } from "./ActionButton";

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
		<ActionButton 
            onClick={handleClick} 
            label="1日だけ除外" 
        />
	);
}
