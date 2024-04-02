import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  iconProps?: React.SVGProps<SVGSVGElement>;
}

export default function Button({ text, Icon, iconProps, ...buttonProps }: ButtonProps) {
  return (
    <>
      <button {...buttonProps}>
        {text && <span className="btn-text">{text}</span>}
        {Icon && (
          <span className="btn-icon">
            <Icon {...iconProps} />
          </span>
        )}
      </button>
    </>
  );
}
