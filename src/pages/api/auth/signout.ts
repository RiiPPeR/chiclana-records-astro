// With `output: 'hybrid'` configured:
// export const prerender = false;
import type { APIRoute } from "astro"
import { logger } from "../logger"

export const GET: APIRoute = async ({ cookies, redirect }) => {
    cookies.delete("sb-access-token", { path: "/" })
    cookies.delete("sb-refresh-token", { path: "/" })
    logger.success("Signed out")
    return redirect("/")
}