import IconButton from "./IconButton";

type CloseButtonProps = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function CloseButton({
  onClick,
  className,
  disabled,
  "aria-label": ariaLabel = "Close modal",
}: CloseButtonProps) {
  return (
    <IconButton
      icon="material-symbols:close"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={className}
    />
  );
}
