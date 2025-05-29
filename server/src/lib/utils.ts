import { PlatformEnvironment, validEnvironments } from "../types/types";

const TEST = "test" as const;

export function isTestingEnv() {
  return process.env.NODE_ENV === TEST;
}

const PRODUCTION = "production" as const;

export function isProductionEnv() {
  return process.env.NODE_ENV === PRODUCTION;
}

function isValidEnvironment(env: string | undefined): env is PlatformEnvironment {
  return validEnvironments.includes(env as PlatformEnvironment);
}

export function getCorsUrl() {
  const platformEnv = process.env.PLATFORM_ENVIRONMENT;
  if (!isValidEnvironment(platformEnv)) {
    throw new Error(
      `Invalid PLATFORM_ENVIRONMENT: "${platformEnv}". Expected one of ${validEnvironments.join(", ")}.`
    );
  }
  let corsDomain;
  if (platformEnv == "docker-compose") {
    corsDomain = `https://${platformEnv}.notesaver:8080`;
  } else if (platformEnv == "minikube") {
    corsDomain = `https://${platformEnv}.notesaver`;
  } else {
    corsDomain = `https://${platformEnv}.notesaver`;
  }
  return corsDomain;
}
