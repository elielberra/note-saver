const TEST = "test" as const;

export function isTestingEnv() {
  return process.env.NODE_ENV === TEST;
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
