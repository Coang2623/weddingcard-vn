import type { InvitationBlock, InvitationTheme, Template } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export const DEFAULT_THEME: InvitationTheme = {
    primaryColor: '#8B0000',
    secondaryColor: '#F8DCE0',
    backgroundColor: '#FDF5F0',
    textColor: '#4A0E0E',
    fontTitle: 'Playfair Display',
    fontBody: 'Lato',
    style: 'minimal',
}

export const BLOCK_TEMPLATES: Record<string, () => InvitationBlock> = {
    hero: () => ({
        id: uuidv4(),
        type: 'hero',
        props: {
            groomName: 'Nguyễn Văn A',
            brideName: 'Trần Thị B',
            weddingDate: '2025-12-12',
            subtitle: 'Trân trọng kính mời',
        },
        visibility: 'all',
        order: 0,
    }),
    countdown: () => ({
        id: uuidv4(),
        type: 'countdown',
        props: {
            targetDate: '2025-12-12T10:00:00',
        },
        visibility: 'all',
        order: 1,
    }),
    story: () => ({
        id: uuidv4(),
        type: 'story',
        props: {
            story: 'Câu chuyện tình yêu của chúng tôi bắt đầu từ một buổi chiều mùa thu...',
        },
        visibility: 'all',
        order: 2,
    }),
    schedule: () => ({
        id: uuidv4(),
        type: 'schedule',
        props: {
            venue: 'Trung tâm Hội nghị ABC',
            address: '123 Đường XYZ, Quận 1, TP.HCM',
            events: [
                { time: '10:00', title: 'Đón khách & Chụp hình' },
                { time: '11:00', title: 'Lễ Cưới' },
                { time: '12:00', title: 'Tiệc Buffet' },
            ],
        },
        visibility: 'all',
        order: 3,
    }),
    map: () => ({
        id: uuidv4(),
        type: 'map',
        props: {
            mapAddress: '123 Đường XYZ, Quận 1, TP.HCM',
        },
        visibility: 'all',
        order: 4,
    }),
    gallery: () => ({
        id: uuidv4(),
        type: 'gallery',
        props: {
            images: [],
        },
        visibility: 'all',
        order: 5,
    }),
    rsvp: () => ({
        id: uuidv4(),
        type: 'rsvp',
        props: {
            rsvpDeadline: '2025-12-05',
        },
        visibility: 'all',
        order: 6,
    }),
    gift: () => ({
        id: uuidv4(),
        type: 'gift',
        props: {
            bankName: 'Vietcombank',
            accountNumber: '0123456789',
            accountName: 'NGUYEN VAN A',
        },
        visibility: 'friends',
        order: 7,
    }),
    guestbook: () => ({
        id: uuidv4(),
        type: 'guestbook',
        props: {
            guestbookTitle: 'Lời Chúc Mừng ❤️',
        },
        visibility: 'all',
        order: 8,
    }),
    text: () => ({
        id: uuidv4(),
        type: 'text',
        props: {
            content: 'Nhập nội dung của bạn tại đây...',
        },
        visibility: 'all',
        order: 9,
    }),
    music: () => ({
        id: uuidv4(),
        type: 'music',
        props: {
            musicUrl: '',
            autoPlay: true,
        },
        visibility: 'all',
        order: 10,
    }),
}

export const DEFAULT_TEMPLATES: Template[] = [
    {
        id: 'minimal-01',
        name: 'Tinh Tế Tối Giản',
        style: 'minimal',
        preview_image: '/templates/minimal-01.jpg',
        is_premium: false,
        default_theme: {
            primaryColor: '#8B0000',
            secondaryColor: '#F8DCE0',
            backgroundColor: '#FDF5F0',
            textColor: '#4A0E0E',
            fontTitle: 'Playfair Display',
            fontBody: 'Lato',
            style: 'minimal',
        },
        default_blocks: [
            BLOCK_TEMPLATES.hero(),
            BLOCK_TEMPLATES.countdown(),
            BLOCK_TEMPLATES.schedule(),
            BLOCK_TEMPLATES.rsvp(),
        ],
    },
    {
        id: 'modern-01',
        name: 'Hiện Đại Sang Trọng',
        style: 'modern',
        preview_image: '/templates/modern-01.jpg',
        is_premium: false,
        default_theme: {
            primaryColor: '#6c63ff',
            secondaryColor: '#e8e6ff',
            backgroundColor: '#ffffff',
            textColor: '#1a1a2e',
            fontTitle: 'Cormorant Garamond',
            fontBody: 'Raleway',
            style: 'modern',
        },
        default_blocks: [
            BLOCK_TEMPLATES.hero(),
            BLOCK_TEMPLATES.story(),
            BLOCK_TEMPLATES.schedule(),
            BLOCK_TEMPLATES.gallery(),
            BLOCK_TEMPLATES.rsvp(),
            BLOCK_TEMPLATES.guestbook(),
        ],
    },
    {
        id: 'cinematic-01',
        name: 'Điện Ảnh Lãng Mạn',
        style: 'cinematic',
        preview_image: '/templates/cinematic-01.jpg',
        is_premium: true,
        default_theme: {
            primaryColor: '#d4af37',
            secondaryColor: '#2c2c2c',
            backgroundColor: '#1a1a1a',
            textColor: '#f5f5f5',
            fontTitle: 'Cinzel',
            fontBody: 'Raleway',
            style: 'cinematic',
        },
        default_blocks: [
            BLOCK_TEMPLATES.hero(),
            BLOCK_TEMPLATES.countdown(),
            BLOCK_TEMPLATES.story(),
            BLOCK_TEMPLATES.schedule(),
            BLOCK_TEMPLATES.map(),
            BLOCK_TEMPLATES.gallery(),
            BLOCK_TEMPLATES.rsvp(),
            BLOCK_TEMPLATES.gift(),
        ],
    },
    {
        id: 'traditional-01',
        name: 'Truyền Thống Đỏ Vàng',
        style: 'traditional',
        preview_image: '/templates/traditional-01.jpg',
        is_premium: false,
        default_theme: {
            primaryColor: '#c0392b',
            secondaryColor: '#f9e4b7',
            backgroundColor: '#fef9f0',
            textColor: '#5d0e0e',
            fontTitle: 'Noto Serif',
            fontBody: 'Noto Sans',
            style: 'traditional',
        },
        default_blocks: [
            BLOCK_TEMPLATES.hero(),
            BLOCK_TEMPLATES.schedule(),
            BLOCK_TEMPLATES.map(),
            BLOCK_TEMPLATES.rsvp(),
        ],
    },
    {
        id: 'vip-01',
        name: 'VIP Pro Max',
        style: 'cinematic',
        preview_image: '/templates/modern-01.jpg',
        is_premium: true,
        default_theme: {
            primaryColor: '#d4af37', // Gold
            secondaryColor: '#0f172a', // Slate 900
            backgroundColor: '#020617', // Slate 950
            textColor: '#f8fafc', // Slate 50
            fontTitle: 'Cinzel',
            fontBody: 'Outfit',
            style: 'cinematic',
        },
        default_blocks: [
            BLOCK_TEMPLATES.hero(),
            BLOCK_TEMPLATES.countdown(),
            BLOCK_TEMPLATES.story(),
            BLOCK_TEMPLATES.gallery(),
            BLOCK_TEMPLATES.schedule(),
            BLOCK_TEMPLATES.map(),
            BLOCK_TEMPLATES.gift(),
            BLOCK_TEMPLATES.guestbook(),
            BLOCK_TEMPLATES.rsvp(),
            BLOCK_TEMPLATES.music(),
        ],
    },
]
