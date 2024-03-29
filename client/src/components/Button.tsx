interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconProps?: React.SVGProps<SVGSVGElement>;
}

export default function Button({ text, Icon, iconProps, ...buttonProps }: ButtonProps) {
  return (
    <>
      <button {...buttonProps}>
        <span id="btn-text">{text}</span>
        {Icon && (
          <span id="btn-icon">
            <Icon {...iconProps} />
          </span>
        )}
      </button>
    </>
  );
}
