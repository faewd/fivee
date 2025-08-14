export const PORT = Deno.env.get("PORT") ?? 8000;
export const BASE_URL = Deno.env.get("BASE_URL") ?? `http://localhost:${PORT}`;
