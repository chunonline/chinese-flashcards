export interface ImageResult {
  url: string
  alt: string
  photographer?: string
  photographerUrl?: string
}

/**
 * Search for images using Pexels API
 * Prioritizes English search terms for better results
 */
export async function searchImages(
  query: string,
  perPage: number = 5
): Promise<ImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY

  if (!apiKey) {
    console.warn('PEXELS_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey
        }
      }
    )

    if (!response.ok) {
      console.error('Pexels API error:', response.status)
      return []
    }

    const data = await response.json()

    return data.photos.map((photo: {
      src: { medium: string; large: string }
      alt: string
      photographer: string
      photographer_url: string
    }) => ({
      url: photo.src.medium,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url
    }))
  } catch (error) {
    console.error('Image search error:', error)
    return []
  }
}

/**
 * Search for an image for a Chinese vocabulary word
 * Uses English translation for better results
 */
export async function searchVocabImage(
  chinese: string,
  english: string
): Promise<ImageResult | null> {
  // Try English search first (usually more accurate)
  let results = await searchImages(english, 3)

  // If no results, try Chinese
  if (results.length === 0) {
    results = await searchImages(chinese, 3)
  }

  if (results.length === 0) {
    return null
  }

  // Return first result
  return results[0]
}

/**
 * Get a placeholder image URL for when no image is found
 */
export function getPlaceholderImage(): string {
  return '/placeholder.svg'
}
