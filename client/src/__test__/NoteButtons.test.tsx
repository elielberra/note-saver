import { screen, fireEvent, waitFor } from "@testing-library/react";
import NoteButtons from "../components/NoteButtons";
import { NoteT } from "../types/types";
import { createRootElement, mockModalFunctions, renderWithProvider } from "./utils/utils";

jest.mock("../lib/utils", () => ({
  getHeadersWithAuthAndContentType: jest.fn(),
  getNewSortedNotes: jest.fn(),
  getNoteToBeUpdated: jest.fn(),
  handleErrorInResponse: jest.fn(),
  handleLogging: jest.fn()
}));
describe("NoteButtons Component", () => {
  it("deletes a note when 'Delete' button is clicked", async () => {
    createRootElement();
    mockModalFunctions();

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true
    });
    global.fetch = mockFetch;

    const mockSetNotes = jest.fn();

    const note: NoteT = {
      noteId: 1,
      noteContent: "Test note",
      tags: [{ tagId: 1, tagContent: "Test Tag" }],
      isActive: true
    };

    const defaultProps = {
      note,
      setNotes: mockSetNotes,
      isShowingActiveNotes: true
    };

    renderWithProvider(<NoteButtons {...defaultProps} />);

    const deleteButton = screen.getByTestId("delete-btn");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(global.HTMLDialogElement.prototype.showModal).toHaveBeenCalled());

    const yesButton = screen.getByText("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockSetNotes).toHaveBeenCalledTimes(1);
    });

    const updaterFn = mockSetNotes.mock.calls[0][0];
    const updatedNotes = updaterFn([note]);

    expect(updatedNotes).toEqual([]);
  });
});
