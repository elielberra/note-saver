import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Notes from "../components/Notes";
import { NoteT, ConfigFile } from "../types/types";
import { createRootElement, mockModalFunctions } from "./utils/utils";
import { ConfigProvider } from "../components/ConfigContext";

describe("Notes Component", () => {
  const mockSetNotes = jest.fn();

  const defaultProps = {
    notes: [],
    setNotes: mockSetNotes,
    isShowingActiveNotes: true,
    searchText: "",
    isFetchingNotes: false
  };

  const mockConfig: ConfigFile = {
    SERVER_URL: "https://docker-compose.server.notesaver:8080" // replace with a valid URL from `validServerUrls`
  };

  function renderWithProvider(ui: React.ReactElement) {
    return render(<ConfigProvider value={mockConfig}>{ui}</ConfigProvider>);
  }

  it("renders fallback text when no notes are available and searchText is empty", () => {
    renderWithProvider(<Notes {...defaultProps} />);
    expect(screen.getByText("You have no notes. Create a new one")).toBeInTheDocument();
  });

  it("renders fallback text for no archived notes", () => {
    renderWithProvider(<Notes {...defaultProps} isShowingActiveNotes={false} />);
    expect(screen.getByText("There are no archived notes")).toBeInTheDocument();
  });

  it("renders fallback text when no notes match the search text", () => {
    renderWithProvider(<Notes {...defaultProps} searchText="text that will not be found" />);
    expect(screen.getByText("There are no notes with that tag")).toBeInTheDocument();
  });

  it("renders notes when notes are provided", () => {
    createRootElement();
    mockModalFunctions();

    const mockedNotes: NoteT[] = [
      {
        noteId: 1,
        noteContent: "Content 1",
        tags: [{ tagId: 1, tagContent: "Tag 2" }],
        isActive: true
      },
      {
        noteId: 2,
        noteContent: "Content 2",
        tags: [{ tagId: 2, tagContent: "Tag 2" }],
        isActive: true
      }
    ];

    renderWithProvider(<Notes {...defaultProps} notes={mockedNotes} />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });
});
