'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'; // um filter in url zu speichern 

export function ProjectsClient({ allProjects }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialFilter = (searchParams.get('filter') as 'all' | 'software' | 'design') ?? 'all';
  const [filter, setFilter] = useState(initialFilter);
  
  // Update URL wenn sich der Filter ändert
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [filter]);


  const filteredProjects =
    filter === 'all'
      ? allProjects
      : allProjects.filter((project) => {
          const tags = Array.isArray(project.metadata.tag)
            ? project.metadata.tag
            : project.metadata.tag
                .split(',')
                .map((t: string) => t.trim().toLowerCase());
          return tags.includes(filter);
        });

  return (
    <div>
      <div className="flex flex-row space-x-0 pr-10 text-xl font-light -ml-2 mb-5">
        <button onClick={() => setFilter('all')} className={`transition-all hover:text-neutral-700 dark:hover:text-neutral-300 flex align-middle relative py-1 px-2 ${filter === 'all' ? '' : 'text-neutral-300 dark:text-neutral-600'}`}>
          Alle Projekte
        </button>
        <button onClick={() => setFilter('software')} className={`transition-all hover:text-neutral-700 dark:hover:text-neutral-300 flex align-middle relative py-1 px-2 ${filter === 'software' ? '' : 'text-neutral-300 dark:text-neutral-600'}`}>
          Coding
        </button>
        <button onClick={() => setFilter('design')} className={`transition-all hover:text-neutral-700 dark:hover:text-neutral-300 flex align-middle relative py-1 px-2 ${filter === 'design' ? '' : 'text-neutral-300 dark:text-neutral-600'}`}>
          Design
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-10">
        {filteredProjects
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1;
          }
          return 1;
        })

        .map((project) => (
          <Link key={project.slug} className="flex flex-col space-y-1" href={`/work/${project.slug}?filter=${filter}`}>
            <div className="relative h-70">
              <Image
                alt={project.metadata.title}
                src={project.metadata.image}
                width="600"
                height="1000"
              />
              <div className="absolute inset-0 z-10 flex text-l text-black bg-white font-light custom-bg-opacity opacity-0 hover:opacity-100 duration-300 hover-overlay">
                <div className="ml-3 mt-2">
                  {project.metadata.title}
                  <br />
                  <span style={{ fontStyle: 'italic' }}>{project.metadata.subtitle}</span>
                  <br />
                  {new Date(project.metadata.publishedAt).getFullYear()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
