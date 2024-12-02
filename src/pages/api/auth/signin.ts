// With `output: 'hybrid'` configured:
// export const prerender = false
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import { logger } from "../logger"

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    logger.info("Received POST request")

    const formData = await request.formData()
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    logger.info("Form Data:", { email, password })

    if (!email || !password) {
        logger.warn("Missing email or password")
        return redirect(`/signin?error=${encodeURIComponent("Debes rellenar todos los campos")}`)
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        logger.error("Error signing in:", error.message)
        return redirect(`/signin?error=${encodeURIComponent(error.message)}`)
    }

    logger.success("Signed in successfully:", data)

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

    if (userError) {
        logger.error("Error fetching user data:", userError.message)
    } else {
        logger.success("User data fetched successfully:", userData)
    }

    // auth tokens
    const { access_token, refresh_token } = data.session
    cookies.set("sb-access-token", access_token, {
        path: "/",
    })
    cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
    })

    // user data
    if (userData) {
        cookies.set("user", JSON.stringify({
            id: userData?.id,
            email: userData?.email,
            username: userData?.username,
            friends: userData?.friends
        }), {
            path: "/"
        })
    }

    logger.info("Redirecting to /dashboard")
    return redirect("/")
}
