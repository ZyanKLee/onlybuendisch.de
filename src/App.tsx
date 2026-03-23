import { AnimatePresence, motion } from 'framer-motion'
import {
  Backpack,
  BadgeCheck,
  Compass,
  Flame,
  Heart,
  Lock,
  MessageCircle,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tent,
  X,
} from 'lucide-react'

import { useEffect, useRef, useState } from 'react'

// Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates)
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const mediaUrl = (name: string) => `${import.meta.env.BASE_URL}gifs/${name}`

const creators = [
  { handle: '@HolzUndHerz', name: 'Holz & Herz', bio: 'Ich zeige dir, wie man es richtig macht … draußen.', tag: 'Feuer & Axt', posts: 128, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80' },
  { handle: '@HalstuchQueen', name: 'Halstuch Queen', bio: 'Stil ist alles – auch im Wald.', tag: 'Knoten & Look', posts: 84, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80' },
  { handle: '@RucksackRalf', name: 'Rucksack Ralf', bio: 'Was wirklich drin ist, zeige ich nur hier.', tag: 'Gear Reveal', posts: 211, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80' },
  { handle: '@FeuerUndFlamme', name: 'Feuer & Flamme', bio: 'Heißer Content. Versprochen.', tag: 'Night Sessions', posts: 342, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&q=80' },
  { handle: '@AxtUndAndacht', name: 'Axt & Andacht', bio: 'Roh. Echt. Und immer am Feuer entstanden.', tag: 'Holz & Feuer', posts: 77, avatar: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=128&q=80' },
  { handle: '@Waldpoet', name: 'Waldpoet', bio: 'Ich war die ganze Nacht draußen… und es war besser als du denkst.', tag: 'Lyrik & Lager', posts: 54, avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=128&q=80' },
  { handle: '@SockeDesSchicksals', name: 'Socke des Schicksals', bio: 'Manchmal wird’s feucht. Aber immer legendär.', tag: 'Socken & Stories', posts: 39, avatar: '/public/profiles/SockeDesSchicksals.jpg' },
  { handle: '@TopfUndTaten', name: 'Topf & Taten', bio: 'Heiß, würzig und direkt vom Feuer.', tag: 'Outdoor-Küche', posts: 61, avatar: 'https://images.unsplash.com/photo-1773507870654-9fb937bb588f?auto=format&fit=crop&w=128&q=80' },
  { handle: '@KnotenKalle', name: 'Knoten Kalle', bio: 'Fester wird’s nicht. Versprochen.', tag: 'Knoten & Tricks', posts: 102, avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=128&q=80' },
  { handle: '@PacklistePro', name: 'Packliste Pro', bio: 'Ich packe Dinge aus… die du nicht erwartet hast.', tag: 'Gear & Tipps', posts: 88, avatar: 'https://images.unsplash.com/photo-1573145833249-404548708ab3?auto=format&fit=crop&w=128&q=80' },
  { handle: '@ZeltGeflüster', name: 'Zelt Geflüster', bio: 'Was nachts im Zelt passiert… bleibt normalerweise im Zelt.', tag: 'Zelt & Nacht', posts: 73, avatar: 'https://images.unsplash.com/photo-1536395155544-a3ba483e0b9b?auto=format&fit=crop&w=128&q=80' },
  { handle: '@GlutUndGloria', name: 'Glut & Gloria', bio: 'Langsam aufgebaut. Lange gehalten.', tag: 'Feuer & Glut', posts: 57, avatar: 'https://images.unsplash.com/photo-1701849939549-d5ad4d92adbb?auto=format&fit=crop&w=128&q=80' },
  { handle: '@RegenRomantik', name: 'Regen Romantik', bio: 'Komplett durchnässt… und ich würde es wieder tun.', tag: 'Regen & Romantik', posts: 44, avatar: 'https://images.unsplash.com/photo-1542801205-5240aa78e9d4?auto=format&fit=crop&w=128&q=80' },
  { handle: '@TrailTiefgang', name: 'Trail Tiefgang', bio: 'Je tiefer der Schlamm, desto besser die Story.', tag: 'Trail & Abenteuer', posts: 69, avatar: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=128&q=80' },
  { handle: '@HolzSpalter69', name: 'HolzSpalter69', bio: 'Ich spalte alles. Wirklich alles.', tag: 'Axt & Spaß', posts: 21, avatar: '/public/profiles/HolzSpalter69.jpg' },
  { handle: '@TeekesselLiebe', name: 'Teekessel Liebe', bio: 'Heiß. Dampfend. Und immer bereit.', tag: 'Tee & Wärme', posts: 33, avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=128&q=80' },
  { handle: '@HalstuchHeiß', name: 'Halstuch Heiß', bio: 'Locker gebunden… aber mit Gefühl.', tag: 'Halstuch & Style', posts: 47, avatar: 'https://images.unsplash.com/photo-1629117083886-509c79515b80?auto=format&fit=crop&w=128&q=80' },
]

const trending = [
  {
    title: '🔥 Lagerfeuer – 3h uncut',
    likes: '12.4k',
    src: mediaUrl('lagerfeuer.mp4'),
    isVideo: true,
  },
  {
    title: 'Er wird diesen Knoten lieben... 😉',
    likes: '9.8k',
    src: mediaUrl('knoten.mp4'),
    isVideo: true,
  },
  {
    title: 'Ich hole alles aus meinem Sack … wirklich alles',
    likes: '8.1k',
    src: mediaUrl('rucksack.mp4'),
    isVideo: true,
  },
  {
    title: 'In unserem Zelt – wenn die Gruppenleiter schlafen 😏',
    likes: '7.2k',
    src: mediaUrl('zelt.mp4'),
    isVideo: true,
  },
  {
    title: 'Dirty Boots – Ich zeige Dir alles nach der Fahrt',
    likes: '6.4k',
    src: mediaUrl('boots.mp4'),
    isVideo: true,
  },
  {
    title: 'Ich liebe es heiß und saftig 💦',
    likes: '5.9k',
    src: mediaUrl('eintopf.mp4'),
    isVideo: true,
  },
] as const

const comments = [
  { author: 'Waldgeist99', text: '🔥 Ihr habt mein Leben verändert' },
  { author: 'KnotenKönig', text: 'Wann kommt mehr Knoten-Content??' },
  { author: 'FeuerFuchs', text: 'Bruder… dieses Feuer 😳' },
  { author: 'RucksackRanger', text: 'Hab direkt meinen Rucksack neu gepackt' },
  { author: 'WilderWilli', text: 'Der Zelt-Content ist zu wild für mich' },
]

const paywallTeasers = [
  { label: 'Schlafsack-Action zu zweit', emoji: '😴', src: mediaUrl('schlafsaecke.mp4') },
  { label: 'Was kommt rein wenn sie heiß ist?', emoji: '🍳', src: mediaUrl('pfanne.mp4') },
  { label: 'Zelt-Chaos', emoji: '⛺', src: mediaUrl('zeltchaos.mp4') },
  { label: 'Von oben bis unten naß am Feuer trocknen', emoji: '🧦', src: mediaUrl('socken.mp4') },
]

function AprilModal({
  open,
  onClose,
  containerRef,
}: {
  open: boolean
  onClose: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="april-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Schließen"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-ob-border bg-gradient-to-b from-ob-card to-ob-surface p-8 shadow-2xl shadow-emerald-950/50"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-ob-muted transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ob-accent-dim px-3 py-1 text-sm font-large text-ob-accent">
              <Sparkles className="h-4 w-4" />
              Du bist auf OnlyBuendisch reingefallen.
            </div>
            <h2 id="april-title" className="font-display text-2xl font-bold tracking-tight text-white">
              April, April!
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ob-muted">
              Statt Premium-Content gibt’s nur: Lagerfeuer, Matsch und gute Laune.
            </p>
            <p className="mt-2 text-[15px] text-emerald-200/90">
              Schön, dass du da bist!
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-ob-accent py-3.5 text-sm font-semibold text-ob-bg transition hover:brightness-110"
            >
              Zurück zur Realität
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const [creatorsToShow, setCreatorsToShow] = useState(8)

  // Responsive: 8 creators only on large (lg, >=1024px), 4 otherwise
  useEffect(() => {
    function updateCreatorsToShow() {
      if (window.innerWidth >= 1024) {
        setCreatorsToShow(8)
      } else {
        setCreatorsToShow(4)
      }
    }
    updateCreatorsToShow()
    window.addEventListener('resize', updateCreatorsToShow)
    return () => window.removeEventListener('resize', updateCreatorsToShow)
  }, [])

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (modalOpen) return;
      if (modalRef.current?.contains(e.target as Node)) return;
      // Modal nicht öffnen, wenn auf ein Video oder Overlay davon geklickt wird
      let node = e.target as HTMLElement | null;
      while (node) {
        // Wenn ein Video-Element in der Kette ist, abbrechen
        if (node.tagName === 'VIDEO') return;
        // Wenn ein Overlay-Element (z.B. .aspect-video) ein Video enthält, abbrechen
        if (node.classList && node.classList.contains('aspect-video')) {
          if (node.querySelector('video')) return;
        }
        node = node.parentElement;
      }
      // Modal nur öffnen, wenn das Ziel im Haupt-Content liegt
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;
      if (!mainContent.contains(e.target as Node)) return;
      e.preventDefault();
      setModalOpen(true);
    };
    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, [modalOpen]);

  return (
    <>
      <div id="main-content" className="relative min-h-svh">
        <header className="sticky top-0 z-50 border-b border-ob-border/80 bg-ob-bg/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-8">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Only<span className="text-ob-accent">Buendisch</span>
              </span>
              <nav className="hidden items-center gap-6 text-sm font-medium text-ob-muted md:flex">
                <span className="transition hover:text-white">Entdecken</span>
                <span className="transition hover:text-white">Creator</span>
                <span className="transition hover:text-white">Nachrichten</span>
                <span className="inline-flex items-center gap-1 text-ob-warm">
                  <Flame className="h-4 w-4" />
                  Premium
                </span>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-lg border border-ob-border bg-ob-surface p-2 text-ob-muted sm:inline-flex">
                <Search className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-medium text-ob-muted sm:inline">Login</span>
              <span className="rounded-full bg-ob-accent px-4 py-2 text-sm font-semibold text-ob-bg">
                Jetzt unterstützen
              </span>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-ob-border">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=80"
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ob-bg via-ob-bg/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ob-bg via-transparent to-ob-bg/40" />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:gap-12">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ob-border bg-ob-surface/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-ob-accent">
                <Star className="h-3.5 w-3.5" />
                Exklusiv für den Bund
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Die heißesten Inhalte aus dem bündischen Leben
              </h1>
              <p className="mt-4 text-lg text-ob-muted">
                Unterstütze deine Lieblings-Creator und entdecke Inhalte, die du so noch nie gesehen hast.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl bg-ob-accent px-5 py-3 text-sm font-semibold text-ob-bg">
                  <Flame className="h-4 w-4" />
                  Jetzt entdecken
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-ob-border bg-ob-surface/80 px-5 py-3 text-sm font-semibold text-white">
                  <Heart className="h-4 w-4 text-ob-warm" />
                  Creator unterstützen
                </span>
              </div>
              <p className="mt-6 text-sm text-ob-muted/90">
                Über <span className="font-semibold text-white">12.000+</span> exklusive Inhalte aus Wald, Fahrt und Lagerfeuer
              </p>
            </div>
            <div className="relative hidden flex-1 lg:block">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-ob-border shadow-2xl">
                <video
                  className="h-full w-full object-cover"
                  src={mediaUrl('lagerfeuer.mp4')}
                  width={640}
                  height={360}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ob-bg/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 backdrop-blur">
                    <Play className="h-4 w-4 fill-white" />
                    Live am Feuer
                  </span>
                  <span className="rounded-full bg-ob-accent/20 px-2 py-0.5 text-xs font-medium text-ob-accent">
                    HD+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Trending Creator</h2>
              <p className="mt-1 text-ob-muted">Verifizierte Profile · echte Fahrten-Energie</p>
            </div>
            <span className="text-sm font-medium text-ob-accent">Alle anzeigen</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shuffle(creators).slice(0, creatorsToShow).map((c) => (
              <div
                key={c.handle}
                className="group flex flex-col rounded-2xl border border-ob-border bg-ob-card p-4 transition hover:border-ob-accent/40 h-full"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={c.avatar}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-ob-border"
                    />
                    <BadgeCheck className="absolute -bottom-0.5 -right-0.5 h-5 w-5 text-sky-400" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{c.name}</p>
                    <p className="text-sm text-ob-accent">{c.handle}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-ob-muted">{c.bio}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-ob-muted pt-4">
                  <span className="rounded-full bg-ob-surface px-2 py-0.5 font-medium text-emerald-200/90">{c.tag}</span>
                  <span>{c.posts} Posts</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-ob-border bg-ob-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Trending Inhalte</h2>
                <p className="mt-1 text-ob-muted">Frisch aus dem Wald · für echte Unterstützer</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-ob-muted">
                <Lock className="h-4 w-4" />
                Nur für Unterstützer
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((item) => (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-2xl border border-ob-border bg-ob-card h-full flex flex-col"
                >
                  <div className="relative aspect-video">
                    {item.isVideo ? (
                      <video
                        className="h-full w-full object-cover"
                        src={item.src}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100 pointer-events-none">
                      <Play
                        className="h-12 w-12 text-white/90"
                        onClick={e => {
                          e.stopPropagation();
                          const video = (e.currentTarget.parentElement?.parentElement?.querySelector('video')) as HTMLVideoElement | null;
                          if (video) {
                            if (video.paused) video.play();
                            else video.pause();
                          }
                        }}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      />
                    </div>
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs backdrop-blur pointer-events-none">
                      <Lock className="h-3 w-3" />
                      Premium
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium leading-snug text-white">{item.title}</h3>
                    <div className="mt-auto flex items-center justify-between text-sm text-ob-muted pt-3">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-4 w-4 text-rose-400" />
                        {item.likes}
                      </span>
                      <span className="text-xs">🔒 gesperrt</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Community</h2>
          <p className="mt-1 text-ob-muted">Was Unterstützer sagen</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comments.map(({ author, text }) => (
              <div
                key={author + text}
                className="rounded-xl border border-ob-border bg-ob-card px-4 py-3 text-sm text-ob-muted"
              >
                <span className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
                  <MessageCircle className="h-4 w-4 text-ob-accent" />
                  Kommentar von {author}
                </span>
                {text}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ob-border bg-ob-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Unterstütze deine Lieblings-Creator</h2>
              <p className="mt-2 text-ob-muted">Transparente Pakete · fair für den Bund</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: 'Basic',
                  price: '3€',
                  perks: ['Zugang zu ausgewählten Inhalten', 'Community-Badge'],
                  icon: Compass,
                  highlight: false,
                },
                {
                  name: 'Premium',
                  price: '7€',
                  perks: ['Alle Inhalte', 'Exklusive Fahrten-Einblicke', 'Früh-Zugang zu Posts'],
                  icon: Flame,
                  highlight: true,
                },
                {
                  name: 'Ultimate',
                  price: '12€',
                  perks: ['„Behind the Scenes“', 'Direktnachrichten an Creator', 'Virtuelles Lagerfeuer'],
                  icon: Tent,
                  highlight: false,
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    tier.highlight
                      ? 'border-ob-accent/50 bg-gradient-to-b from-ob-accent-dim/80 to-ob-card shadow-lg shadow-emerald-950/30'
                      : 'border-ob-border bg-ob-card'
                  }`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ob-accent px-3 py-0.5 text-xs font-semibold text-ob-bg">
                      Beliebt
                    </span>
                  )}
                  <tier.icon className={`h-8 w-8 ${tier.highlight ? 'text-ob-accent' : 'text-ob-muted'}`} />
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {tier.price}
                    <span className="text-base font-normal text-ob-muted">/Monat</span>
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-ob-muted">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ob-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span
                    className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold ${
                      tier.highlight
                        ? 'bg-ob-accent text-ob-bg'
                        : 'border border-ob-border bg-ob-surface text-white'
                    }`}
                  >
                    Paket wählen
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Behind the Paywall</h2>
              <p className="mt-1 text-ob-muted">Ein Blick hinter die Kulissen – fast.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {paywallTeasers.map((t) => (
              <div
                key={t.label}
                className="relative aspect-square overflow-hidden rounded-xl border border-ob-border bg-ob-card cursor-pointer group"
                onClick={() => setModalOpen(true)}
              >
                {t.src && (
                  <video
                    src={t.src}
                    className="absolute inset-0 h-full w-full object-cover blur-sm group-hover:blur-md transition-all duration-200"
                    autoPlay
                    loop
                    muted
                    playsInline
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 h-full w-full pointer-events-none">
                  <span className="absolute left-3 top-3 text-3xl drop-shadow-md">{t.emoji}</span>
                  <div className="absolute left-0 right-0 bottom-0 flex items-end">
                    <span className="mb-3 ml-3 text-xs text-ob-muted bg-ob-card/80 rounded px-2 py-0.5 shadow">{t.label}</span>
                  </div>
                </div>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/55 p-2 pointer-events-none">
                  <Lock className="h-6 w-6 text-white" />
                  <span className="text-center text-xs font-medium text-white">Nur für Unterstützer sichtbar</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ob-border bg-gradient-to-b from-ob-surface/50 to-ob-bg py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Backpack className="mx-auto h-10 w-10 text-ob-accent" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Werde Teil der Community</h2>
            <p className="mt-3 text-ob-muted">
              und entdecke Inhalte, die sonst verborgen bleiben.
            </p>
            <span className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ob-bg">
              Jetzt kostenlos registrieren
            </span>
          </div>
        </section>

        <footer className="border-t border-ob-border py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
            <span className="font-display text-lg font-bold text-white">
              Only<span className="text-ob-accent">Buendisch</span>
            </span>
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-ob-muted">
              <span>Über uns</span>
              <span>Datenschutz</span>
              <span>Impressum</span>
              <span>Kontakt</span>
            </nav>
          </div>
          <p className="mt-6 text-center text-xs text-ob-muted/60">
            © {new Date().getFullYear()} OnlyBuendisch · Parodie / Aprilscherz · jugendfrei & bündisch
          </p>
        </footer>
      </div>

      <AprilModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        containerRef={modalRef}
      />
    </>
  )
}
