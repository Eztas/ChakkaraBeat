// src/components/ui/UpdateUrlButton.tsx
import { ActionButton } from "./ActionButton";

type UpdateUrlButtonProps = {
	onClick: () => void;
};

export function UpdateUrlButton({ onClick }: UpdateUrlButtonProps) {
	return (
		<ActionButton 
            onClick={onClick} 
            label="着火する (URL追加)" 
        />
	);
}
