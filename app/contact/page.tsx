
export const metadata = {
  title: 'Kontakt',
  description: 'Kontakt Informationen',
}

export default function Page() {
  return (
    <section>
      <h4 className="font-semibold text-xl mb-8 tracking-tighter">Kontakt</h4>
        <a
          className="flex items-center transition-all hover:text-neutral-700 dark:hover:text-neutral-300"
          rel="noopener noreferrer"
          target="_blank"
          href="mailto:hello@dudunurisik.de"
        >
        <p className="ml-0 h-7">hello@dudunurisik.de</p>
      </a>
    </section>
  )
}