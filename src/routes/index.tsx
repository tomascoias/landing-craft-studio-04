import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  Globe,
  Home,
  Library,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spotify — Web Player: música para todos" },
      {
        name: "description",
        content: "Ouve música, artistas e podcasts populares no Spotify Web Player.",
      },
      { property: "og:title", content: "Spotify — Web Player: música para todos" },
      {
        property: "og:description",
        content: "Ouve música, artistas e podcasts populares no Spotify Web Player.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpotifyHome,
});

const tracks = [
  { image: album1, title: "Puxa o Lança", artist: "MC Jvila, KayBlack, Veigh, Vulgo FK", explicit: true },
  { image: album2, title: "BbY WOW", artist: "KAROL G, Judeline, rusowsky" },
  { image: album3, title: "Nicole Kidman", artist: "ADÉLA", explicit: true },
  { image: album4, title: "Alcatraz", artist: "Plutonio" },
  { image: album5, title: "Escola é linda", artist: "VM e XOODÓ", explicit: true },
  { image: album6, title: "Nos vai ficar, sem se sufocar", artist: "Mc Lele JP, DJ Andrabbeat", explicit: true },
];

const artists = [
  { image: album1, name: "Plutonio", position: "object-center" },
  { image: album5, name: "Buba Espinho", position: "object-top" },
  { image: album3, name: "Bárbara Bandeira", position: "object-center" },
  { image: album2, name: "The Weeknd", position: "object-top" },
  { image: album4, name: "Slow J", position: "object-center" },
  { image: album6, name: "Dillaz", position: "object-center" },
];

function BrandMark() {
  return (
    <a href="#inicio" aria-label="Spotify" className="flex shrink-0 items-center gap-2 text-foreground">
      <span className="grid size-10 place-items-center rounded-full bg-foreground text-background">
        <span className="spotify-waves" aria-hidden="true"><i /><i /><i /></span>
      </span>
      <span className="hidden text-xl font-bold xl:inline">Spotify</span>
    </a>
  );
}

function SpotifyHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTracks = tracks.filter((track) =>
    `${track.title} ${track.artist}`.toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt")),
  );

  return (
    <div id="inicio" className="h-dvh min-h-[600px] overflow-hidden bg-background text-foreground">
      <header className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <BrandMark />

        <div className="mx-auto flex min-w-0 flex-1 items-center justify-center gap-2 xl:max-w-2xl">
          <Button aria-label="Início" title="Início" variant="secondary" size="icon" className="size-12 shrink-0 rounded-full">
            <Home className="size-6" />
          </Button>
          <label className="group relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 size-6 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="O que queres reproduzir?"
              aria-label="Pesquisar música e artistas"
              className="h-12 rounded-full border-transparent bg-secondary pl-12 pr-12 text-base shadow-none hover:bg-surface-raised focus-visible:ring-2"
            />
            {query ? (
              <Button type="button" onClick={() => setQuery("")} aria-label="Limpar pesquisa" variant="ghost" size="icon" className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-full">
                <X />
              </Button>
            ) : (
              <span className="absolute right-4 top-1/2 h-6 w-px -translate-y-1/2 bg-border" />
            )}
          </label>
        </div>

        <nav className="hidden shrink-0 items-center gap-3 text-sm font-bold text-muted-foreground lg:flex">
          <a href="#premium" className="hover:text-foreground">Premium</a>
          <a href="#apoio" className="hover:text-foreground">Apoio</a>
          <a href="#transferir" className="hover:text-foreground">Transferir</a>
          <span className="mx-2 h-6 w-px bg-border" />
          <a href="#instalar" className="flex items-center gap-1.5 hover:text-foreground"><CircleArrowDown /> Instalar app</a>
          <a href="#registo" className="ml-2 hover:text-foreground">Regista-te</a>
          <Button className="h-12 rounded-full bg-foreground px-7 font-bold text-background hover:bg-foreground/90">Iniciar sessão</Button>
        </nav>

        <Button onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu" variant="ghost" size="icon" className="shrink-0 rounded-full lg:hidden">
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {menuOpen && (
        <nav className="absolute right-3 top-14 z-50 flex w-60 flex-col gap-1 rounded-md border border-border bg-popover p-2 text-sm font-bold shadow-xl lg:hidden">
          {["Premium", "Apoio", "Transferir", "Instalar app", "Regista-te"].map((item) => <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="rounded px-3 py-3 hover:bg-secondary">{item}</a>)}
          <Button className="mt-1 rounded-full bg-foreground text-background hover:bg-foreground/90">Iniciar sessão</Button>
        </nav>
      )}

      <div className="grid h-[calc(100dvh-4rem)] grid-cols-1 gap-2 px-2 pb-2 md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 flex-col overflow-hidden rounded-md bg-sidebar md:flex">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3 font-bold"><Library className="size-5" /> A tua Biblioteca</div>
            <Button variant="secondary" className="rounded-full font-bold"><Plus /> Criar</Button>
          </div>
          <div className="library-scroll mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto px-2">
            <div className="rounded-md bg-secondary p-5">
              <h2 className="font-bold">Cria a tua primeira playlist</h2>
              <p className="mt-2 text-sm font-medium">É fácil, nós ajudamos</p>
              <Button className="mt-5 rounded-full bg-foreground px-5 font-bold text-background hover:bg-foreground/90">Criar playlist</Button>
            </div>
            <div className="mt-6 rounded-md bg-secondary p-5">
              <h2 className="max-w-[28ch] font-bold">Vamos lá encontrar alguns podcasts para seguires</h2>
              <p className="mt-2 text-sm font-medium">Vamos atualizar-te sobre os novos episódios</p>
              <Button className="mt-5 rounded-full bg-foreground px-5 font-bold text-background hover:bg-foreground/90">Explorar podcasts</Button>
            </div>
            <div className="mt-auto px-5 pb-6 pt-10">
              <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
                {['Termos Legais','Centro de Segurança e Privacidade','Política de Privacidade','Definições de cookies','Acerca dos anúncios','Acessibilidade'].map((link) => <a href="#legal" key={link} className="hover:underline">{link}</a>)}
                <a href="#cookies" className="font-semibold text-foreground hover:underline">Cookies</a>
              </div>
              <Button variant="outline" className="mt-8 rounded-full bg-transparent font-bold"><Globe /> Português</Button>
            </div>
          </div>
        </aside>

        <main className="content-scroll relative min-w-0 overflow-y-auto rounded-md bg-surface pb-12">
          <section className="px-5 pb-8 pt-7 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between gap-4">
              <h1 className="text-2xl font-bold sm:text-3xl">Músicas populares</h1>
              <button type="button" className="text-sm font-bold text-muted-foreground hover:underline">Mostrar tudo</button>
            </div>

            {filteredTracks.length ? (
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                {filteredTracks.map((track) => (
                  <article key={track.title} className="group min-w-0 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-secondary shadow-lg">
                      <img src={track.image} alt={`Capa de ${track.title}`} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                      <Button aria-label={`Reproduzir ${track.title}`} size="icon" className="absolute bottom-2 right-2 size-12 translate-y-3 rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="ml-0.5 text-lg">▶</span>
                      </Button>
                    </div>
                    <h2 className="mt-3 truncate font-semibold">{track.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                      {track.explicit && <span className="mr-1.5 rounded-sm bg-muted-foreground px-1 text-[10px] font-bold text-background">E</span>}
                      {track.artist}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid min-h-52 place-items-center text-center text-muted-foreground">Não encontrámos resultados para “{query}”.</div>
            )}
          </section>

          <section className="px-5 py-7 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold sm:text-3xl">Artistas populares</h2>
              <button type="button" className="text-sm font-bold text-muted-foreground hover:underline">Mostrar tudo</button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
              {artists.map((artist) => (
                <article key={artist.name} className="group min-w-0 cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-full bg-secondary shadow-lg">
                    <img src={artist.image} alt={artist.name} className={`size-full object-cover ${artist.position} transition-transform duration-300 group-hover:scale-[1.03]`} />
                    <Button aria-label={`Reproduzir ${artist.name}`} size="icon" className="absolute bottom-3 right-3 size-12 translate-y-3 rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="ml-0.5 text-lg">▶</span>
                    </Button>
                  </div>
                  <h3 className="mt-3 truncate font-semibold">{artist.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Artista</p>
                </article>
              ))}
            </div>
          </section>

          <footer className="mx-5 mt-10 flex flex-col justify-between gap-8 border-t border-border px-2 py-8 text-sm text-muted-foreground sm:mx-8 sm:flex-row lg:mx-12">
            <span>© 2026 Spotify AB</span>
            <div className="flex flex-wrap gap-5"><a href="#legal" className="hover:text-foreground">Legal</a><a href="#privacidade" className="hover:text-foreground">Privacidade</a><a href="#cookies" className="hover:text-foreground">Cookies</a></div>
          </footer>

          <button type="button" aria-label="Ver mais" className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-muted-foreground shadow-xl hover:text-foreground xl:grid"><ChevronRight /></button>
          <button type="button" aria-label="Voltar" className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-muted-foreground shadow-xl hover:text-foreground xl:grid"><ChevronLeft /></button>
        </main>
      </div>
    </div>
  );
}