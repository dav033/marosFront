import type { ModalHeaderProps } from "@/types/components/modal";

import CloseButton from "../atoms/CloseButton.tsx";

export default function ModalHeader({ title, onClose, id }: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-light-text" id={id}>
        {title}
      </h3>
      <CloseButton onClick={onClose} className="ml-2" />
    </div>
  );
}
