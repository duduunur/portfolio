import Link from 'next/link';
import { getProjects } from 'app/work/utils';
import Image from 'next/image';
import { ProjectsClient } from './ProjectsClient';
import { Suspense } from 'react';

export function Projects() {
  const allProjects = getProjects();

  return (
    <Suspense fallback={<div className="text-gray-500">Projekte werden geladen...</div>}>
      <ProjectsClient allProjects={allProjects} />
    </Suspense>
  );
}
