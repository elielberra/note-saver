import { Link } from "react-router-dom";
import "./PageNotFound.css";

export default function PageNotFound() {
  return (
    <div id="not-found-container">
      <p>
        That page you entered was not found. Go back to the <Link to="/">main page</Link>.
      </p>
    </div>
  );
}
