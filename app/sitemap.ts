import { getProjects } from 'app/work/utils'

export const baseUrl = 'https://dudunurisik.de'

export default async function sitemap() {
  let projects = getProjects().map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }))

  let routes = ['', '/work'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...projects]
}
