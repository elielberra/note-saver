export function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}

export function getProxyPort() {
  return isProductionEnv() ? "443" : "8080";
}
