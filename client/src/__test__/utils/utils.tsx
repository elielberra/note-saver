import { render } from "@testing-library/react";
import { ConfigFile } from "../../types/types";
import { ConfigProvider } from "../../components/ConfigContext";

export function mockModalFunctions() {
  global.HTMLDialogElement.prototype.showModal = jest.fn();
  global.HTMLDialogElement.prototype.close = jest.fn();
}

export function createRootElement() {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "root");
  document.body.appendChild(portalRoot);
}

export const mockConfig: ConfigFile = {
  SERVER_URL: "https://docker-compose.server.notesaver:8080"
};

export function renderWithProvider(ui: React.ReactElement) {
  return render(<ConfigProvider value={mockConfig}>{ui}</ConfigProvider>);
}
