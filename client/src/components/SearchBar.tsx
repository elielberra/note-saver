import "./SearchBar.css";
import MaginfyingGlassIcon from "../components/icons/MagnifyingGlassIcon";
import { NoteT } from "../types/types";
import { FormEventHandler } from "react";
import { fetchNotes } from "../lib/utils";

type SearchBarProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({
  setNotes,
  isShowingActiveNotes,
  searchText,
  setSearchText
}: SearchBarProps) {
  async function filterNotes(event: React.ChangeEvent<HTMLInputElement>) {
    const filteringText = event.target.value;
    setSearchText(filteringText);
    if (!filteringText) fetchNotes(setNotes, isShowingActiveNotes);
    await fetchNotes(setNotes, isShowingActiveNotes, filteringText);
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await fetchNotes(setNotes, isShowingActiveNotes, searchText);
  };

  return (
    <div id="search-bar">
      <form id="search-form" onSubmit={handleSubmit}>
        <input
          placeholder="Search by tag..."
          id="search-input"
          value={searchText}
          onChange={filterNotes}
        />
        <button type="submit" id="search-button">
          <MaginfyingGlassIcon width="95%" />
        </button>
      </form>
    </div>
  );
}
