import { Projects } from 'app/components/projects'
import { ProjectsClient } from 'app/components/ProjectsClient';
import { getProjects } from 'app/work/utils';
import { Suspense } from 'react';


export const metadata = {
  title: 'Project',
  description: 'Here are my Projects.',
  // hier entscheiden, obs indexiert werden soll oder nicht 
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function Page() {
  return (
    <section>
      <Projects />
    </section>
  )
}
