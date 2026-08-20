// src/components/ui/UpdateUrlButton.tsx
import { ActionButton } from "./ActionButton";

type UpdateUrlButtonProps = {
	onClick: () => void;
};

export function UpdateUrlButton({ onClick }: UpdateUrlButtonProps) {
	return <ActionButton onClick={onClick} label="URL更新" />;
}
