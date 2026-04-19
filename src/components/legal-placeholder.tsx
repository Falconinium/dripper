export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
      <p className="text-muted-foreground mb-8 text-xs tracking-[0.25em] uppercase">
        Informations légales
      </p>
      <h1 className="font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
        Cette page sera complétée avant le lancement public.
      </p>
    </article>
  );
}
