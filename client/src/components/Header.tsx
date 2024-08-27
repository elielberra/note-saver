import "./Header.css";
import NoteIcon from "../components/icons/NoteIcon";
import { useUserContext } from "./UserContext";
import Button from "./Button";

export default function Header() {
  const { isLoggedIn, logout, username } = useUserContext();
  return (
    <div id="header">
      <div id="logo">
        <NoteIcon height={40} />
        <h1 id="logo-text">NoteSaver</h1>
      </div>
      {isLoggedIn && (
        <div id="user-section">
          <Button id="logout-btn" text="Logout" onClick={async () => await logout()} />
          <p id="user-salutation">
            Hi <span id="username-text">{username}</span>!
          </p>
        </div>
      )}
    </div>
  );
}
