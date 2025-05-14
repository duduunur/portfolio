export const baseUrl = 'https://dudunurisik.de'

export default async function sitemap() {
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split('T')[0],
    },
  ]
}
