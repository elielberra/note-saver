import './SearchBar.css';
import MaginfyingGlassIcon from '../components/icons/MagnifyingGlassIcon'
import { NoteT } from '@backend/types';
import { useState } from 'react';

type SearchBarProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
}

export default function SearchBar({setNotes, isShowingActiveNotes}: SearchBarProps) {
    const [searchText, setSearchText] = useState("");

    return (
        <div id="search-bar">
            <form id="search-form">
                <input placeholder="Search by tag..." id="search-input" value={searchText} />
                <button type="submit" id="search-button">
                <MaginfyingGlassIcon width="95%"/>
                </button>
            </form>
        </div>)
}