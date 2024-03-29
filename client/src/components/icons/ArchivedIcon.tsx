import type { SVGProps } from "react";

export default function ArchivedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={props.height || "100%"}
      preserveAspectRatio="true"
      fill="#161F3C"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M19 2a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm1 6H4v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1zm-7.883 9.993L12 18l-.084-.004-.117-.016-.111-.03-.111-.044-.098-.052-.074-.05-.112-.097-3-3a1 1 0 0 1 1.32-1.497l.094.083L11 14.585V11a1 1 0 0 1 .883-.993L12 10a1 1 0 0 1 1 1v3.585l1.293-1.292a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-3 3-.085.076-.07.051-.098.057-.114.05-.074.023zM19 4H5a1 1 0 0 0-1 1v1h16V5a1 1 0 0 0-1-1"
      />
    </svg>
  );
}
