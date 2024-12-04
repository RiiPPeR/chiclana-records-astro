import type { APIRoute } from 'astro'
import { RecordService } from '../../../../lib/models/record'
import type { User } from '../../../../lib/models/types/types'
import { logger } from "../../logger"

export const POST: APIRoute = async ({ request, cookies, redirect, params }) => {
    logger.info('Received POST request for discogs_id:', params.discogs_id)
    
    const user: User = cookies.get("user") ? JSON.parse(cookies.get("user")!.value) : null
    if (!user) return redirect('/signin')
    
    const record = await request.json()
    
    const result = await new RecordService().addRecordToCollection(
        user.id,
        Number(params.discogs_id),
        record.title,
        record.artist,
        record.image_url || '',
        record.country || '',
        Number(record.year) || 0,
        record.label || '',
        record.catno || ''
    )

    if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 })
    }

    return new Response(JSON.stringify({ success: true }))
}

export const DELETE: APIRoute = async ({ cookies, params }) => {
    logger.info('Received DELETE request for discogs_id:', params.discogs_id)

    const user: User = cookies.get("user") ? JSON.parse(cookies.get("user")!.value) : null
    if (!user) return new Response(null, { status: 401 })

    const result = await new RecordService().deleteRecordFromCollection(
        user.id, 
        Number(params.discogs_id)
    )

    if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 })
    }

    return new Response(JSON.stringify({ success: true }))
}