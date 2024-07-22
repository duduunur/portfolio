import { Projects } from 'app/components/projects'

export const metadata = {
  title: 'Project',
  description: 'Here are my Projects.',
  // hier entscheiden, obs indexiert werden soll oder nicht 
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Work</h1>
      <Projects />
    </section>
  )
}
