import type { ModalHeaderProps } from '@/types/components/modal';
import CloseButton from '../atoms/CloseButton';

export default function ModalHeader({
  title,
  onClose,
  id,
  rightSlot,
}: ModalHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-700 px-4 py-3">
      <h3 className="text-light-text text-lg font-semibold" id={id}>
        {title}
      </h3>

      <div className="flex items-center gap-2">
        {rightSlot ? <div>{rightSlot}</div> : null}
        <CloseButton onClick={onClose} className="ml-2" />
      </div>
    </div>
  );
}
