// With `output: 'hybrid'` configured:
// export const prerender = false;
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import type { User } from "../../../lib/models/types/types"

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const email = formData.get("email")?.toString()
	const username = formData.get("username")?.toString()
	const password = formData.get("password")?.toString()

	if (!email || !password || !username) {
		return redirect(`/register?error=${encodeURIComponent("Debes de rellenar los campos")}`)
	}

	try {
		const result = await supabase
			.from('users')
			.select('*')
			.eq('username', username)
			.single();

		if (result.data) {
			return redirect(`/register?error=${encodeURIComponent("El nombre de usuario ya existe")}`)
		}

		const { data: authResponse, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
		})

		if (!authResponse?.user) {
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
			.insert(newUser);

		if (insertError) {
			return redirect(`/register?error=${encodeURIComponent(insertError.message)}`)
		}

		if (signUpError) {
			return redirect(`/register?error=${encodeURIComponent(signUpError.message)}`)
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Error inesperado.'
		return redirect(`/register?error=${encodeURIComponent(errorMessage)}`)
	}

	return redirect("/signin")
}