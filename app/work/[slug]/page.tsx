import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { getProjects } from 'app/work/utils'
import { baseUrl } from 'app/sitemap'

function ArrowIcon() {
  return (
    <svg
    width="15"
    height="15"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
d="M9.92898 11.3494L11.0369 10.2415L2.7983 1.98864H9.16193L9.14773 0.454545H0.15625V9.46023H1.70455L1.69035 3.09659L9.92898 11.3494Z"      fill="currentColor"
    />
  </svg>
  );
}

export async function generateStaticParams() {
  let projects = getProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }) {
  let project = getProjects().find((project) => project.slug === params.slug)
  if (!project) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = project.metadata
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/work/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  }
}

export default function Work({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { filter?: string };
}) {
  const filter = searchParams?.filter ?? 'all';
  const project = getProjects().find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
      <div className="antialiased max-w-2xl mb-40 flex flex-col md:flex-row mt-20 lg:mx-auto">
      <section>
        <a
          href={`/?filter=${filter}`}
          className="transition-all hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          <ArrowIcon />
        </a>
      <h1 className="mt-5 text-lg tracking-tight">
        {project.metadata.title} <br/>
        <p className="font-light italic">{project.metadata.subtitle}</p>
        <p className="font-light">{new Date(project.metadata.publishedAt).getFullYear()}</p>
      </h1>
      <article className="prose">
        <CustomMDX source={project.content} />
      </article>
     
    </section>
    </div>
  )
}
