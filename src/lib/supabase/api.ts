import { createClient } from '@/lib/supabase/client'
import type { InvitationBlock, InvitationTheme } from '@/types'
import { DEFAULT_THEME } from '@/lib/templates'

const supabase = createClient()

// ---- Invitations CRUD ----

export async function getMyInvitations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('invitations')
        .select('*, invitation_designs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getInvitationById(id: string) {
    const { data, error } = await supabase
        .from('invitations')
        .select('*, invitation_designs(*)')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getInvitationBySlug(slug: string) {
    const { data, error } = await supabase
        .from('invitations')
        .select('*, invitation_designs(*)')
        .eq('slug', slug)
        .single()

    if (error) throw error
    return data
}

export async function createInvitation(data: {
    title: string
    slug: string
    wedding_date?: string
}) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create invitation
    const { data: invitation, error: invError } = await supabase
        .from('invitations')
        .insert({
            user_id: user.id,
            title: data.title,
            slug: data.slug,
            wedding_date: data.wedding_date || null,
            is_published: true, // Auto publish by default
        })
        .select()
        .single()

    if (invError) throw invError

    // Create default design
    const { error: designError } = await supabase
        .from('invitation_designs')
        .insert({
            invitation_id: invitation.id,
            theme: DEFAULT_THEME as unknown as Record<string, unknown>,
            blocks: [],
        })

    if (designError) throw designError

    return invitation
}

// ---- Design (Blocks) Save/Load ----

export async function loadDesignBlocks(invitationId: string): Promise<{
    blocks: InvitationBlock[]
    theme: InvitationTheme
    designId: string
}> {
    const { data, error } = await supabase
        .from('invitation_designs')
        .select('*')
        .eq('invitation_id', invitationId)
        .single()

    if (error) throw error

    return {
        blocks: (data.blocks as InvitationBlock[]) || [],
        theme: (data.theme as unknown as InvitationTheme) || DEFAULT_THEME,
        designId: data.id,
    }
}

export async function saveDesignBlocks(
    invitationId: string,
    blocks: InvitationBlock[],
    theme?: InvitationTheme,
) {
    const updateData: Record<string, unknown> = {
        blocks: blocks as unknown as Record<string, unknown>[],
        updated_at: new Date().toISOString(),
    }
    if (theme) {
        updateData.theme = theme as unknown as Record<string, unknown>
    }

    const { error } = await supabase
        .from('invitation_designs')
        .update(updateData)
        .eq('invitation_id', invitationId)

    if (error) throw error
}

export async function updateInvitation(id: string, data: {
    title?: string
    slug?: string
    is_published?: boolean
    wedding_date?: string
}) {
    const { error } = await supabase
        .from('invitations')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

// ---- RSVP ----

export async function getRSVPs(invitationId: string) {
    const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function submitRSVP(data: {
    invitation_id: string
    guest_name: string
    attending: boolean
    guest_count?: number
    message?: string
}) {
    const { error } = await supabase
        .from('rsvps')
        .insert(data)

    if (error) throw error
}

// ---- Messages (Guestbook) ----

export async function getMessages(invitationId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function postMessage(data: {
    invitation_id: string
    author_name: string
    content: string
}) {
    const { error } = await supabase
        .from('messages')
        .insert(data)

    if (error) throw error
}

// ---- Auth helpers ----

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function signOut() {
    await supabase.auth.signOut()
}
