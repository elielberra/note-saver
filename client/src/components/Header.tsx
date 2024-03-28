import "./Header.css";
import NoteIcon from "../components/icons/NoteIcon";

export default function Header() {
	return (
		<div id="header">
			<div id="title">
				<NoteIcon />
				<h1>NoteKeeper</h1>
			</div>
		</div>
	);
}
