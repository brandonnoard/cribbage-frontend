import * as shared from "../../basePath.shared";

export const normalizeBasePath = shared.normalizeBasePath;
export const routerBasename = shared.routerBasename;
export const viteBase = shared.viteBase;
export const appOriginPath = shared.appOriginPath;

export function appBasePath(): string {
  return shared.normalizeBasePath(import.meta.env.VITE_BASE_PATH);
}

export function absoluteAppUrl(origin: string): string {
  return shared.absoluteAppUrl(origin, appBasePath());
}
