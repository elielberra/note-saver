const TEST = "test" as const;

export function isTestingEnv() {
  return process.env.NODE_ENV === TEST;
}

const PRODUCTION = "production" as const;

export function isProductionEnv() {
  return process.env.NODE_ENV === PRODUCTION;
}

const DEV_PROXY_PORT = ":8080" as const;

export function getCorsPort() {
  return isProductionEnv() ? "" : DEV_PROXY_PORT;
}
