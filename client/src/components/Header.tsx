import "./Header.css";
import NoteIcon from "../components/icons/NoteIcon";

export default function Header() {
	return (
		<div id="header">
			<div id="title">
				<NoteIcon height={40} />
				<h1>NoteKeeper</h1>
			</div>
		</div>
	);
}
