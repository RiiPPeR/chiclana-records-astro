export interface User {
    id: string
    email: string
    username: string
    created_at: string
    friends?: string[] | null
}

export interface Record {
    artist: string
    catno: string | null
    country: string | null
    created_at: string | null
    discogs_id: number
    image_url: string | null
    label: string | null
    title: string
    year: number | null
}

export interface UserRecord {
    added_at: string | null
    discogs_id: number | null
    id: string
    user_id: string | null
}
