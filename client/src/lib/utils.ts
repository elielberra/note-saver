import {
  IsAuthenticatedResponse,
  IsAuthenticatedSuccessfulResponse,
  IsAuthenticatedUnsuccessfulResponse,
  NoteT
} from "../types/types";

export function getAuthTokenFromStorage() {
  return `Bearer ${sessionStorage.getItem("authToken")}`;
}

export function getHeadersWithAuth() {
  return { "Authorization": getAuthTokenFromStorage() };
}

export function getHeadersWithContentType() {
  return { "Content-Type": "application/json" };
}

export function getHeadersWithAuthAndContentType() {
  return { 
    ...getHeadersWithAuth(), 
    ...getHeadersWithContentType()
  };
}

export async function fetchNotes(
  setNotes: (value: React.SetStateAction<NoteT[]>) => void,
  notesStatus: boolean,
  filteringText: string | null = null
) {
  try {
    const response = await fetch(
      `https://server.notesaver:3333/notes?areActive=${notesStatus}${
        filteringText ? `&filteringText=${filteringText}` : ""
      }`,
      {
        headers: getHeadersWithAuth()
      }
    );
    if (!response.ok) {
      handleErrorInResponse(response);
      return;
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

export async function handleErrorInResponse(responseWithError: Response) {
  const responseWithErrorBody = await responseWithError.text();
  console.log(
    `- Response body: ${responseWithErrorBody}\n` +
      `- Status code: ${responseWithError.status}\n` +
      `- Server error: ${responseWithError.statusText}\n`
  );
}

export async function validateAndGetUserIfAuthenticated(): Promise<IsAuthenticatedResponse> {
  try {
    const response = await fetch("https://server.notesaver:3333/isauthenticated", {
      headers: getHeadersWithAuth()
    });
    if (!response.ok && response.status !== 401 && response.status !== 403) {
      handleErrorInResponse(response);
      return { isAuthenticated: false };
    } else if (response.status === 401 || response.status === 403) {
      return (await response.json()) as IsAuthenticatedUnsuccessfulResponse;
    }
    return (await response.json()) as IsAuthenticatedSuccessfulResponse;
  } catch (error) {
    console.error("Error while checking user authentication status");
    if (!isProductionEnv()) console.error(error);
    return { isAuthenticated: false } as IsAuthenticatedResponse;
  }
}
