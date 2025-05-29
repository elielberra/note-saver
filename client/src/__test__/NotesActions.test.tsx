import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteActions from "../components/NotesActions";
import { ConfigProvider } from "../components/ConfigContext";
import { ConfigFile } from "../types/types";

jest.mock("../lib/utils", () => ({
  fetchNotes: jest.fn(),
  getHeadersWithAuth: jest.fn(),
  handleErrorInResponse: jest.fn(),
  handleLogging: jest.fn()
}));

const mockConfig: ConfigFile = {
  SERVER_URL: "https://docker-compose.server.notesaver:8080"
};

describe("NoteActions Component", () => {
  function renderWithProvider(ui: React.ReactElement) {
    return render(<ConfigProvider value={mockConfig}>{ui}</ConfigProvider>);
  }

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

    renderWithProvider(<NoteActions {...defaultProps} />);

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
