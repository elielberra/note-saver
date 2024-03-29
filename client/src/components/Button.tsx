interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    iconProps?: React.SVGProps<SVGSVGElement>;
}

export default function Button({ text, Icon, iconProps, ...buttonProps }: ButtonProps) {
    console.log(Icon)
    return (
        <>
            <button {...buttonProps}>
                <span id="btn-text">{text}</span>
                <Icon {...iconProps} />
            </button>
        </>
    )
}
