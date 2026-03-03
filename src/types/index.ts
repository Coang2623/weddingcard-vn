// Wedding Invitation Types

export type BlockType =
    | 'hero'
    | 'story'
    | 'gallery'
    | 'schedule'
    | 'rsvp'
    | 'map'
    | 'guestbook'
    | 'gift'
    | 'countdown'
    | 'text'

export interface BlockProps {
    // Hero block
    groomName?: string
    brideName?: string
    weddingDate?: string
    subtitle?: string
    backgroundImage?: string
    backgroundVideo?: string
    // Story block
    story?: string
    couplePhoto?: string
    // Gallery block
    images?: string[]
    // Schedule block
    events?: ScheduleEvent[]
    venue?: string
    address?: string
    dressCode?: string
    // RSVP block
    rsvpDeadline?: string
    maxGuests?: number
    // Map block
    mapAddress?: string
    mapEmbedUrl?: string
    // Guestbook block
    guestbookTitle?: string
    // Gift block
    bankName?: string
    accountNumber?: string
    accountName?: string
    qrCodeUrl?: string
    // Countdown block
    targetDate?: string
    // Text block
    content?: string
    // Common
    [key: string]: unknown
}

export interface ScheduleEvent {
    time: string
    title: string
    description?: string
}

export interface InvitationBlock {
    id: string
    type: BlockType
    props: BlockProps
    visibility: 'all' | 'family' | 'friends'
    order: number
}

export interface InvitationTheme {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    fontTitle: string
    fontBody: string
    style: 'traditional' | 'modern' | 'cinematic' | 'minimal'
}

export interface Invitation {
    id: string
    user_id: string
    slug: string
    title: string
    is_published: boolean
    is_protected: boolean
    pin_code?: string
    wedding_date?: string
    view_count: number
    created_at: string
    updated_at: string
}

export interface InvitationDesign {
    id: string
    invitation_id: string
    theme: InvitationTheme
    blocks: InvitationBlock[]
    custom_css?: string
    created_at: string
    updated_at: string
}

export interface Guest {
    id: string
    invitation_id: string
    name: string
    phone?: string
    email?: string
    group_type: 'all' | 'family' | 'friends' | 'colleagues'
    created_at: string
}

export interface RSVP {
    id: string
    invitation_id: string
    guest_id?: string
    guest_name: string
    attending: boolean
    guest_count: number
    dietary_requirements?: string
    message?: string
    created_at: string
}

export interface Message {
    id: string
    invitation_id: string
    author_name: string
    content: string
    created_at: string
}

export interface Template {
    id: string
    name: string
    style: 'traditional' | 'modern' | 'cinematic' | 'minimal'
    preview_image: string
    default_theme: InvitationTheme
    default_blocks: InvitationBlock[]
    is_premium: boolean
}
