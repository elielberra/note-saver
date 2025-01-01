import log from "../logging";
import {
  IsAuthenticatedResponse,
  IsAuthenticatedSuccessfulResponse,
  IsAuthenticatedUnsuccessfulResponse,
  LogLevels,
  NoteT
} from "../types/types";

export function getAuthTokenFromStorage() {
  return `Bearer ${sessionStorage.getItem("authToken")}`;
}

export function getHeadersWithAuth() {
  return { Authorization: getAuthTokenFromStorage() };
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
      `https://server.notesaver:8080/notes?areActive=${notesStatus}${
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
    handleLogging("error", "Error while fetching the notes", error);
  }
}

export function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleLogging(logLevel: LogLevels, message: string, error?: unknown) {
  switch (logLevel) {
    case "debug":
      log.debug(message);
      break;
    case "info":
      log.info(message);
      break;
    case "warning":
      log.warn(message);
      break;
    case "error":
      log.error(message);
      break;
  }
  // TODO: Add logic for sending the log to the server
}

export async function handleErrorInResponse(responseWithError: Response) {
  const responseWithErrorBody = await responseWithError.text();
  const logFullText =
    `- Response body: ${responseWithErrorBody}\n` +
    `- Status code: ${responseWithError.status}\n` +
    `- Server error: ${responseWithError.statusText}`;
  handleLogging("error", logFullText);
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

export async function validateAndGetUserIfAuthenticated(): Promise<IsAuthenticatedResponse> {
  try {
    const response = await fetch("https://server.notesaver:8080/isauthenticated", {
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
    handleLogging("error", "Error while checking user authentication status", error);
    return { isAuthenticated: false } as IsAuthenticatedResponse;
  }
}
