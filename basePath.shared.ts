/** Normalize VITE_BASE_PATH; missing/empty values default to web root. */
export function normalizeBasePath(input: string | undefined): string {
  const trimmed = input?.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return withLeading.replace(/\/+$/, "") || "/";
}

/** React Router basename: empty at web root, otherwise e.g. `/cribbage`. */
export function routerBasename(basePath: string): string {
  return basePath === "/" ? "" : basePath;
}

/** Vite `base` option: `/` at root, `/cribbage/` in a subdirectory. */
export function viteBase(basePath: string): string {
  return basePath === "/" ? "/" : `${basePath}/`;
}

/** App entry path with trailing slash, e.g. `/` or `/cribbage/`. */
export function appOriginPath(basePath: string): string {
  const basename = routerBasename(basePath);

  return basename ? `${basename}/` : "/";
}

export function absoluteAppUrl(origin: string, basePath: string): string {
  return `${origin.replace(/\/+$/, "")}${appOriginPath(basePath)}`;
}
