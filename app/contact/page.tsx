
export const metadata = {
  //hier indexierung verhindern
  title: 'Kontakt',
  description: 'Kontakt Informationen',
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
      {/* <h4 className="font-light text-xl mb-8 tracking-tighter">Kontakt</h4>*/}
        <a
          className="flex items-center transition-all hover:text-neutral-700 dark:hover:text-neutral-300 font-light"
          rel="noopener noreferrer"
          target="_blank"
          href="mailto:dudunurisik@gmail.com"
        >
        <p className="ml-0 h-7">dudunurisik@gmail.com</p>
      </a>
    </section>
  )
}