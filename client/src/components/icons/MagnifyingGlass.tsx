import type { SVGProps } from "react";

export default function MagnifyingGlass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || "100%"}
      height={props.height || "100%"}
      fill="#161f3c"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z"
        clipRule="evenodd"
      />
    </svg>
  );
}
