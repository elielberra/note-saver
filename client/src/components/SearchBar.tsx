import './SearchBar.css';
import MaginfyingGlassIcon from '../components/icons/MagnifyingGlassIcon'


export default function SearchBar() {
    return (
        <div id="search-bar">
            <form id="search-form">
                <input placeholder="Search by tag..." id="search-input"/>
                <button type="submit" id="search-button">
                <MaginfyingGlassIcon width="95%"/>
                </button>
            </form>
        </div>)
}