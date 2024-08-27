import "./Header.css";
import NoteIcon from "../components/icons/NoteIcon";
import { useUserContext } from "./UserContext";

export default function Header() {
  const { isLoggedIn, username } = useUserContext();
  return (
    <div id="header">
      <div id="title">
        <NoteIcon height={40} />
        <h1>NoteSaver</h1>
        {isLoggedIn && <p id="user-salutation">Hi <span id="username-text">{username}</span>!</p>}
      </div>
  </div>
  );
}
