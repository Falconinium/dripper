export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-8 px-6 py-24">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Dripper · phase 0</p>
      <h1 className="text-6xl leading-[1.05] font-normal italic">
        Le guide des cafés
        <br />
        de spécialité.
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
        Là où le café est pris au sérieux. Carte, critères Sélection et carnet de dégustation —
        bientôt.
      </p>
    </main>
  );
}
