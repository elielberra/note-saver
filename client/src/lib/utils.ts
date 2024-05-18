import { GetNotesParams, NoteT } from "@backend/types";

export async function getNotes(
  setNotes: (value: React.SetStateAction<NoteT[]>) => void,
  notesStatus: boolean
) {
  const queryParams: GetNotesParams = `areActive=${notesStatus}`;
  try {
    const response = await fetch(`/notes?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Error while fetching the notes. Request Status Code: ${response.status}`);
  }
  const activeNotes: NoteT[] = await response.json();
  setNotes(activeNotes);
  } catch (error) {
    // TODO: Hide error output on production
    console.error("Error while fetching the notes:", error);
  }
  
}
