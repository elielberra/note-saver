import { NoteT } from "@backend/types";

export async function fetchNotes(
  setNotes: (value: React.SetStateAction<NoteT[]>) => void,
  notesStatus: boolean,
  filteringText: string | null = null
) {
  try {
    const response = await fetch(`/notes?areActive=${notesStatus}${filteringText ? `&filteringText=${filteringText}` : ''}`);
    if (!response.ok) {
      throw new Error(`Error while fetching the notes. Request Status Code: ${response.status}`);
    }
    const activeNotes: NoteT[] = await response.json();
    setNotes(activeNotes);
  } catch (error) {
    console.error("Error while fetching the notes");
    if (!isProductionEnv()) console.error(error)
  }
}

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production';
}
