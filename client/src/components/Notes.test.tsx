import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Notes from "./Notes";
import { NoteT } from "../types/types";

describe("Notes Component", () => {
  const mockSetNotes = jest.fn();

  const defaultProps = {
    notes: [],
    setNotes: mockSetNotes,
    isShowingActiveNotes: true,
    searchText: "",
    isFetchingNotes: false
  };

  it("renders fallback text when no notes are available and searchText is empty", () => {
    render(<Notes {...defaultProps} />);
    expect(screen.getByText("You have no notes. Create a new one")).toBeInTheDocument();
  });

  it("renders fallback text for no archived notes", () => {
    render(<Notes {...defaultProps} isShowingActiveNotes={false} />);
    expect(screen.getByText("There are no archived notes")).toBeInTheDocument();
  });

  it("renders fallback text when no notes match the search text", () => {
    render(<Notes {...defaultProps} searchText="text that will not be found" />);
    expect(screen.getByText("There are no notes with that tag")).toBeInTheDocument();
  });

  it("renders notes when notes are provided", () => {
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "root");
    document.body.appendChild(portalRoot);

    global.HTMLDialogElement.prototype.showModal = jest.fn();
    global.HTMLDialogElement.prototype.close = jest.fn();

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

    render(<Notes {...defaultProps} notes={mockedNotes} />);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });
});
