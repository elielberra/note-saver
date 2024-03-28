import './SearchBar.css';
import MaginfyingGlass from '../components/icons/MagnifyingGlass'


export default function SearchBar() {
    return (
        <div id="search-bar">
            <form id="search-form">
                <input placeholder="Search notes by its tag..." id="search-input"/>
                <button type="submit" id="search-button">
                <MaginfyingGlass />
                </button>
            </form>
        </div>)
}