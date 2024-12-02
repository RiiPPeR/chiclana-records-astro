// With `output: 'hybrid'` configured:
// export const prerender = false;
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import type { User } from "../../../lib/models/types/types"
import { logger } from "../logger"

export const POST: APIRoute = async ({ request, redirect }) => {
	logger.info("Received POST request")
	const formData = await request.formData()
	const email = formData.get("email")?.toString()
	const username = formData.get("username")?.toString()
	const password = formData.get("password")?.toString()

	logger.info("Form Data:", { email, username, password })

	if (!email || !password || !username) {
		logger.warn("Missing fields")
		return redirect(`/register?error=${encodeURIComponent("Debes de rellenar los campos")}`)
	}

	try {
		const result = await supabase
			.from('users')
			.select('*')
			.eq('username', username)
			.single()

		if (result.data) {
			logger.warn("Username already exists")
			return redirect(`/register?error=${encodeURIComponent("El nombre de usuario ya existe")}`)
		}

		const { data: authResponse, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
		})

		if (!authResponse?.user) {
			logger.warn("Email already in use")
			return redirect(`/register?error=${encodeURIComponent("El correo ya está en uso")}`)
		}

		const newUser: User = {
			id: authResponse.user.id,
			username,
			email,
			friends: [],
			created_at: new Date().toISOString(),
		}

		const { error: insertError } = await supabase
			.from('users')
			.insert(newUser)

		if (insertError) {
			logger.error("Error inserting new user:", insertError.message)
			return redirect(`/register?error=${encodeURIComponent(insertError.message)}`)
		}

		if (signUpError) {
			logger.error("Sign up error:", signUpError.message)
			return redirect(`/register?error=${encodeURIComponent(signUpError.message)}`)
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Error inesperado.'
		logger.error("Unexpected error:", errorMessage)
		return redirect(`/register?error=${encodeURIComponent(errorMessage)}`)
	}

	logger.success("User registered successfully")
	return redirect("/signin")
}
