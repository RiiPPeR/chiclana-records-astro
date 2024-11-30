import type { Record } from './types/types';
import { supabase } from '../supabase';

export class RecordService {
    private supabase = supabase;
    /**
     * Retrieves the records associated with a specific user.
     *
     * @param userId - The ID of the user whose records are to be retrieved.
     * @returns A promise that resolves to an array of `Record` objects associated with the user.
     *
     * @throws Will return an empty array if an error occurs during the retrieval process.
     */
    async getUserRecords(userId: string): Promise<Record[]> {
        try {
            const { data: userRecords } = await this.supabase
                .from('user_records')
                .select('*')
                .eq('user_id', userId);

            if (!userRecords?.length) return [];

            const discogsIds = userRecords.map(ur => ur.discogs_id);

            const { data: records } = await this.supabase
                .from('records')
                .select('*')
                .in('discogs_id', discogsIds);

            return records || [];
        } catch {
            return [];
        }
    }

    /**
     * Retrieves a record from the database based on the provided Discogs ID.
     *
     * @param discogsId - The Discogs ID of the record to retrieve.
     * @returns A promise that resolves to the record if found, or null if not found or an error occurs.
     */
    async getRecord(discogsId: number): Promise<Record | null> {
        try {
            const { data } = await this.supabase
                .from('records')
                .select('*')
                .eq('discogs_id', discogsId)
                .single();

            return data;
        } catch {
            return null;
        }
    }

    /**
     * Searches for records in the database that match the given search term.
     *
     * @param searchTerm - The term to search for in the record titles.
     * @returns A promise that resolves to an array of records that match the search term.
     *          If no records are found or an error occurs, an empty array is returned.
     */
    async searchRecords(searchTerm: string): Promise<Record[]> {
        try {
            const { data: records } = await this.supabase
                .from('records')
                .select('*')
                .ilike('title', `%${searchTerm}%`);

            return records || [];
        } catch {
            return [];
        }
    }

    /**
     * Adds a record to the collection and associates it with a user.
     * 
     * @param userId - The ID of the user adding the record.
     * @param discogsId - The Discogs ID of the record.
     * @param title - The title of the record.
     * @param artist - The artist of the record.
     * @param imageUrl - The URL of the record's image.
     * @param country - The country of origin of the record.
     * @param year - The release year of the record.
     * @param label - The label of the record.
     * @param catalogNumber - The catalog number of the record.
     * @returns A promise that resolves to an object indicating success or failure, and an optional error message.
     */
    async addRecordToCollection(
        userId: string,
        discogsId: number,
        title: string,
        artist: string,
        imageUrl: string,
        country: string,
        year: number,
        label: string,
        catalogNumber: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // Check if record exists
            const { data: existingRecord } = await this.supabase
                .from('records')
                .select('*')
                .eq('discogs_id', discogsId)
                .single();

            // Add record if it doesn't exist
            if (!existingRecord) {
                await this.supabase.from('records').insert({
                    discogs_id: discogsId,
                    title,
                    artist,
                    image_url: imageUrl,
                    country,
                    year,
                    label,
                    catno: catalogNumber // Add the artist property
                });
            }

            // Check if user already has the record
            const { data: existingUserRecord } = await this.supabase
                .from('user_records')
                .select('*')
                .eq('user_id', userId)
                .eq('discogs_id', discogsId)
                .single();

            if (existingUserRecord) {
                return { success: false, error: 'Ya has añadido ese disco.' };
            }

            // Add user record
            await this.supabase.from('user_records').insert({
                id: crypto.randomUUID(),
                user_id: userId,
                discogs_id: discogsId,
                added_at: new Date().toISOString()
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }

    /**
     * Deletes a record from the user's collection and, if no other user has the record, deletes the record from the main records table.
     *
     * @param userId - The ID of the user whose record is to be deleted.
     * @param discogsId - The Discogs ID of the record to be deleted.
     * @returns A promise that resolves to an object indicating the success of the operation and an optional error message.
     */
    async deleteRecordFromCollection(
        userId: string,
        discogsId: number
    ): Promise<{ success: boolean; error?: string }> {
        try {
            await this.supabase
                .from('user_records')
                .delete()
                .eq('user_id', userId)
                .eq('discogs_id', discogsId);

            const { data: remainingUserRecords } = await this.supabase
                .from('user_records')
                .select('*')
                .eq('discogs_id', discogsId);

            if (!remainingUserRecords?.length) {
                await this.supabase
                    .from('records')
                    .delete()
                    .eq('discogs_id', discogsId);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }

    async hasRecord(userId: string, discogsId: number): Promise<boolean> {
        try {
            const { data } = await this.supabase
                .from('user_records')
                .select('*')
                .eq('user_id', userId)
                .eq('discogs_id', discogsId);

            return !!data?.length;
        } catch {
            return false;
        }
    }
}