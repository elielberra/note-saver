import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteActions from "../components/NotesActions";

jest.mock("../lib/utils", () => ({
  fetchNotes: jest.fn(),
  getHeadersWithAuth: jest.fn(),
  handleErrorInResponse: jest.fn(),
  handleLogging: jest.fn(),
  getProxyPort: jest.fn()
}));

describe("NoteActions Component", () => {
  it("adds a new note when 'Add' button is clicked", async () => {
    const mockSetNotes = jest.fn();
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => ({ newNoteId: 3 })
    });

    global.fetch = mockFetch;

    const defaultProps = {
      setNotes: mockSetNotes,
      isShowingActiveNotes: true,
      setIsShowingActiveNotes: jest.fn(),
      searchText: "",
      setSearchText: jest.fn()
    };

    render(<NoteActions {...defaultProps} />);

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockSetNotes).toHaveBeenCalledTimes(1);
    });

    const updaterFn = mockSetNotes.mock.calls[0][0];
    const updatedNotes = updaterFn([]);
    expect(updatedNotes).toEqual([
      {
        noteId: 3,
        noteContent: "",
        tags: [],
        isActive: true
      }
    ]);
  });
});
