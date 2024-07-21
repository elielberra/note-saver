import { NoteT } from "../types/types";

export async function fetchNotes(
  setNotes: (value: React.SetStateAction<NoteT[]>) => void,
  notesStatus: boolean,
  filteringText: string | null = null
) {
  try {
    const response = await fetch(
      `http://localhost:3333/notes?areActive=${notesStatus}${filteringText ? `&filteringText=${filteringText}` : ""}`
    );
    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(
        `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
      );
    }
    const activeNotes: NoteT[] = await response.json();
    setNotes(activeNotes);
  } catch (error) {
    console.error("Error while fetching the notes");
    if (!isProductionEnv()) console.error(error);
  }
}

export function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}

export function handleErrorLogging(error: unknown, message: string) {
  console.error(message);
  if (!isProductionEnv() && error instanceof Error) console.error(error);
}

export function getNoteToBeUpdated(prevNotes: NoteT[], noteToBeUpdatedId: NoteT["noteId"]) {
  const oldNote = prevNotes.find((note) => note.noteId === noteToBeUpdatedId);
  if (!oldNote) {
    throw new Error(`No corresponding note was found for the note id ${noteToBeUpdatedId}`);
  }
  return oldNote;
}

export function getNewSortedNotes(
  prevNotes: NoteT[],
  noteToBeUpdatedId: NoteT["noteId"],
  newNote: NoteT
) {
  const newNotes = [...prevNotes.filter((note) => note.noteId !== noteToBeUpdatedId), newNote];
  const sortedNewNotes = newNotes.sort((a, b) => a.noteId - b.noteId);
  return sortedNewNotes;
}
