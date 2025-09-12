import { Icon } from "@iconify/react";
import type { ModalHeaderProps } from "../../../types/components/modal";

export default function ModalHeader({ title, onClose, id }: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-light-text" id={id}>
        {title}
      </h3>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-700 rounded"
        aria-label="Close modal"
      >
        <Icon
          icon="material-symbols:close"
          className="h-5 w-5 text-light-text"
        />
      </button>
    </div>
  );
}
