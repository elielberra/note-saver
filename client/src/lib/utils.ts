import log from "../logging";
import {
  IsAuthenticatedResponse,
  IsAuthenticatedSuccessfulResponse,
  IsAuthenticatedUnsuccessfulResponse,
  LogData,
  LogLevels,
  NoteT,
  UNSPECIFIED_ERROR,
  UnsuccessfulAuthResponse
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
      `https://server.notesaver:${getProxyPort()}/notes?areActive=${notesStatus}${
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

const PRODUCTION = "production" as const;

export function isProductionEnv() {
  return process.env.NODE_ENV === PRODUCTION;
}

const PROD_PROXY_PORT = "443" as const;
const DEV_PROXY_PORT = "8080" as const;

export function getProxyPort() {
  return isProductionEnv() ? PROD_PROXY_PORT : DEV_PROXY_PORT;
}

export async function handleLogging(logLevel: LogLevels, message: string, error?: unknown) {
  switch (logLevel) {
    case "debug":
      log.debug(message);
      break;
    case "info":
      log.info(message);
      break;
    case "warn":
      log.warn(message);
      break;
    case "error":
      log.error(message, error);
      break;
  }
  const requestBody: LogData = {
    logLevel,
    logMessage: message,
    service: "client",
    timestamp: new Date()
  };
  if (error instanceof Error) {
    requestBody.errorName = error.name;
    requestBody.errorMessage = error.message;
    requestBody.errorStack = error.stack;
  } else {
    requestBody.errorName = UNSPECIFIED_ERROR;
  }
  try {
    const response = await fetch(`https://server.notesaver:${getProxyPort()}/logs`, {
      method: "POST",
      headers: sessionStorage.getItem("authToken")
        ? getHeadersWithAuthAndContentType()
        : getHeadersWithContentType(),
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      log.error(await getResponseErrorFormatted(response));
    }
  } catch (error) {
    log.error(`Error while trying to send a log to the server`, error);
  }
}

async function getResponseErrorFormatted(
  responseWithError: Response,
  responseBody?: UnsuccessfulAuthResponse
) {
  return (
    `- Response body: ${responseBody ? responseBody : await responseWithError.text()}\n` +
    `- Status code: ${responseWithError.status}\n` +
    `- Server error: ${responseWithError.statusText}`
  );
}

export async function handleErrorInResponse(
  responseWithError: Response,
  responseBody?: UnsuccessfulAuthResponse
) {
  handleLogging("error", await getResponseErrorFormatted(responseWithError, responseBody));
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
    const response = await fetch(`https://server.notesaver:${getProxyPort()}/isauthenticated`, {
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
