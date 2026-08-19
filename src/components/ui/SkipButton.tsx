// src/components/ui/SkipButton.tsx

import { ActionButton } from "@/components/ui/ActionButton";
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

	return <ActionButton onClick={handleClick} label="1日だけ除外" />;
}
