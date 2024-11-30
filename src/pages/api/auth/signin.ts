// With `output: 'hybrid'` configured:
// export const prerender = false
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData()
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return new Response(error.message, { status: 500 })
    }

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

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

    return redirect("/dashboard")
}