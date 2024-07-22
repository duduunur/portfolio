import Link from 'next/link';
import { getProjects } from 'app/work/utils';
import Image from 'next/image';

export function Projects() {
  let allProjects = getProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {allProjects
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1;
          }
          return 1;
        })
        .map((project) => (
          <Link
            key={project.slug}
            className="flex flex-col space-y-1"
            href={`/work/${project.slug}`}
          >
            <div className="relative h-70">
              <Image
                alt={project.metadata.title}
                src={project.metadata.image}
                width="600"
                height="1000"
              />
              <div className="absolute inset-0 z-10 flex text-l text-black bg-white font-light custom-bg-opacity opacity-0 hover:opacity-100 duration-300 hover-overlay">
                <div className="ml-3 mt-2">
                 {project.metadata.title} <br />
                   <span style={{ fontStyle: 'italic' }}>
                     {project.metadata.subtitle}
                    </span>
                    <br />
                     {project.metadata.publishedAt}
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

