import Header from "./Header";
import NoteActions from "./NoteActions";
import Notes from "./Notes";
import { useEffect } from "react";
import "./App.css"

export default function App() {
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/test")
      const data = await res.json()
      console.log(data)
    }
    fetchData();
  }, [])
  
  fetch("/test")
  return (
    <>
      <Header />
      <NoteActions />
      <Notes />
    </>
  );
}
