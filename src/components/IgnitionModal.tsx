// src/components/ui/IgnitionModal.tsx
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { ActionButton } from "./ui/ActionButton";

type IgnitionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onIgnite: (youtubeId: string) => void;
};

export function IgnitionModal({ isOpen, onClose, onIgnite }: IgnitionModalProps) {
  const [youtubeId, setYoutubeId] = useState("");

  const handleSubmit = () => {
    if (youtubeId.length === 11) {
      onIgnite(youtubeId);
      setYoutubeId("");
      onClose();
    } else {
      alert("YouTube IDは11桁で入力してください");
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-slate-900 border-amber-900/50">
        <DrawerHeader>
          <DrawerTitle className="text-amber-500">着火準備 (YouTube ID入力)</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex flex-col gap-4">
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="dQw4w9WgXcQ"
            className="w-full p-2 bg-slate-800 text-white rounded border border-slate-700"
          />
          <ActionButton onClick={handleSubmit} label="火を灯す" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
