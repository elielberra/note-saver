import Header from "./Header";
import SearchBar from "./SearchBar";
import NoteActions from "./NoteActions";
import Notes from "./Notes";
import "./App.css"

export default function App() {
  return (
    <>
      <Header />
      <SearchBar />
      <NoteActions />
      <Notes />
    </>
  );
}
