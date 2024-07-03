import { RotatingLines } from "react-loader-spinner";
import "./LoadingSpinner.css";

export default function Loader() {
  return (
    <div id="spinner">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
}
