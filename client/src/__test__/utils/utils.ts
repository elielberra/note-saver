export function mockModalFunctions() {
  global.HTMLDialogElement.prototype.showModal = jest.fn();
  global.HTMLDialogElement.prototype.close = jest.fn();
}

export function createRootElement() {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "root");
  document.body.appendChild(portalRoot);
}
