// /**
//  * Where the "Search on Aqstra" chips send people. Set NEXT_PUBLIC_AQSTRA_SEARCH_URL to the
//  * page of your app that accepts ?q= (it is visible to browsers, so it must not be a secret).
//  */
// export const SEARCH_BASE = process.env.NEXT_PUBLIC_AQSTRA_SEARCH_URL ?? "https://app.aqstra.com/search";

// export const searchUrl = (query: string) =>
//   `${SEARCH_BASE}${SEARCH_BASE.includes("?") ? "&" : "?"}q=${encodeURIComponent(query)}&utm_source=news&utm_medium=insights`;

// export const SIGNUP_URL = "/#start";
// export const DEMO_URL = "/get-a-demo";

// export const FEATURED_HOURS = 48;
// export const ROLLING_PAGE = 12;
// export const ARCHIVE_PAGE = 20;
// export const REVALIDATE_SECONDS = 300;





/**
 * Where the "Search on Aqstra" chips send people. Set NEXT_PUBLIC_AQSTRA_SEARCH_URL to the
 * page of your app that accepts ?q= (it is visible to browsers, so it must not be a secret).
 */
export const SEARCH_BASE = process.env.NEXT_PUBLIC_AQSTRA_SEARCH_URL ?? "https://app.aqstra.com/search";

export const searchUrl = (query: string) =>
  `${SEARCH_BASE}${SEARCH_BASE.includes("?") ? "&" : "?"}q=${encodeURIComponent(query)}&utm_source=news&utm_medium=insights`;

export const SIGNUP_URL = "/#start";
export const DEMO_URL = "/get-a-demo";

export const FEATURED_HOURS = 48;
export const ROLLING_PAGE = 12;
export const ARCHIVE_PAGE = 20;
export const REVALIDATE_SECONDS = 300;

/** How long each featured story stays in the big slot (ms). Slow on purpose, so people can read. */
export const FEATURED_ROTATE_MS = Number(process.env.NEXT_PUBLIC_FEATURED_ROTATE_MS) || 10_000;