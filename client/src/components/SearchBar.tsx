import './SearchBar.css';
import magnifyingGlassIcon from '../assets/magnifying-glass.svg'

export default function SearchBar() {
    return (
        <div id="search-bar">
            <form id="search-form">
                <input placeholder="Search note by tag..." id="search-input"/>
                <button type="submit" id="search-button">
                    <img src={magnifyingGlassIcon} alt="Magnifying glass icon" id="magnifying-glass-icon" />
                </button>
            </form>
        </div>)
}