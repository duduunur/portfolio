import Link from 'next/link';
import { getProjects } from 'app/work/utils';
import Image from 'next/image';
import { ProjectsClient } from './ProjectsClient';


export function Projects() {
  const allProjects = getProjects();

  return <ProjectsClient allProjects={allProjects} />;
}

