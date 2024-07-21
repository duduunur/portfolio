
export const metadata = {
  //hier indexierung verhindern
  title: 'Kontakt',
  description: 'Kontakt Informationen',
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
      {/* <h4 className="font-light text-xl mb-8 tracking-tighter">Kontakt</h4>*/}
        <a
          className="flex items-center transition-all hover:text-neutral-700 dark:hover:text-neutral-300 font-light"
          rel="noopener noreferrer"
          target="_blank"
          href="mailto:hello@dudunurisik.de"
        >
        <p className="ml-0 h-7">hello@dudunurisik.de</p>
      </a>
    </section>
  )
}