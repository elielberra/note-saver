import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

interface ButtonProps {
}
export default function Button({ Icon, ...buttonProps }: ButtonProps) {
    console.log(Icon)
    return (
        <>
            <button {...buttonProps}>
                Add note
                <Icon fill="orange" width="100%" height="100%"/>
            </button>
        </>
    )
}
