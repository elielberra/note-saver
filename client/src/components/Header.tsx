import './Header.css';
import noteIcon from '../assets/note-icon.svg';

export default function Header() {
    return (
        <div id="header">
            <div id="title">
                <img src={noteIcon} alt="NoteKeeper logo" id="note-icon"/>
                <h1>NoteKeeper</h1>
            </div>
        </div>
    )
}
