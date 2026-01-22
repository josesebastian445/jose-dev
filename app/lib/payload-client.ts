import { getPayload } from 'payload'
import config from '@payload-config'

let payload: any = null

export async function getPayloadClient() {
  if (payload) {
    return payload
  }

  try {
    payload = await getPayload({ config })
    return payload
  } catch (error) {
    console.error('Failed to initialize Payload:', error)
    return null
  }
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  publishedDate: string
  tags?: Array<{ tag: string }>
  status: 'draft' | 'published'
  featuredImage?: {
    url: string
    alt: string
  }
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return []
    }

    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      sort: '-publishedDate',
      limit: 100,
    })

    return docs as Post[]
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      return null
    }

    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return docs.length > 0 ? (docs[0] as Post) : null
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}
