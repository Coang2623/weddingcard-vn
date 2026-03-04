import { Metadata, ResolvingMetadata } from 'next'
import ClientInvitation from './ClientInvitation'
import { createClient } from '@/lib/supabase/server'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    // Create a Supabase client capable of reading cookies
    const supabase = await createClient()

    const { data: invData } = await supabase
        .from('invitations')
        .select('id, title, is_published')
        .eq('slug', slug)
        .single()

    if (!invData) {
        return { title: 'Thiệp cưới không tồn tại' }
    }

    const { data: designData } = await supabase
        .from('invitation_designs')
        .select('blocks')
        .eq('invitation_id', invData.id)
        .single()

    let heroImage = '/og-image-default.jpg' // fallback
    let description = 'Trân trọng kính mời đến dự tiệc cưới của chúng tôi.'

    if (designData?.blocks) {
        const blocks = designData.blocks as any[]
        const heroBlock = blocks.find(b => b.type === 'hero')
        if (heroBlock) {
            heroImage = heroBlock.props.backgroundImage || heroImage
            if (heroBlock.props.weddingDate) {
                description = `Trân trọng kính mời đến dự tiệc cưới của ${heroBlock.props.groomName} và ${heroBlock.props.brideName} vào ngày ${heroBlock.props.weddingDate}.`
            }
        }
    }

    return {
        title: invData.title,
        description: description,
        openGraph: {
            title: invData.title,
            description: description,
            images: [heroImage],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: invData.title,
            description: description,
            images: [heroImage],
        },
    }
}

export default async function Page({ params }: Props) {
    const p = await params
    return <ClientInvitation slug={p.slug} />
}
