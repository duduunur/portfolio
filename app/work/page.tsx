import { Projects } from 'app/components/projects'

export const metadata = {
  title: 'Project',
  description: 'Here are my Projects.',
  // hier entscheiden, obs indexiert werden soll oder nicht 
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
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
