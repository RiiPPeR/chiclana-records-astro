import type { APIRoute } from 'astro'
import { RecordService } from '../../../lib/models/record'
import type { User } from '../../../lib/models/types/types'
import { logger } from "../logger"

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    logger.info('Received POST request');
    
    const user: User = cookies.get("user") ? JSON.parse(cookies.get("user")!.value) : null
    logger.info('User:', user);

    if (!user) {
        logger.info('No user found, redirecting to /signin');
        return redirect('/signin')
    }
    
    const formData = await request.formData()
    logger.info('Form Data:', Object.fromEntries(formData.entries()));

    let title = formData.get('title') as string;

    title = title.split(" - ")[1] || title;

    const result = await new RecordService().addRecordToCollection(
        user.id,
        Number(formData.get('discogs_id')),
        title,
        formData.get('artist') as string,
        formData.get('image_url') as string,
        formData.get('country') as string,
        Number(formData.get('year')),
        formData.get('label') as string,
        formData.get('catno') as string
    )
    logger.info('Result:', result);

    if (!result.success) {
        logger.error('Error adding record:', result.error);
        return new Response(JSON.stringify({ error: result.error }), { status: 400 })
    }

    const url = new URL(request.url)
    const searchQuery = formData.get('searchQuery') as string

    logger.info('Search Query:', searchQuery);

    const redirectUrl = `/recordsearch${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    logger.info('Redirect URL:', redirectUrl);

    return redirect(redirectUrl)
}