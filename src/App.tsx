// Vince Analytics/Plausible custom event tracking: add plausible to window type
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { Flame, Heart, Play, Star, X } from 'lucide-react'

import { useState } from 'react'

// Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates)
const mediaUrl = (name: string) => `${import.meta.env.BASE_URL}gifs/${name}`

function ImpressumModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="impressum-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.button
            type="button"
            aria-label="Schließen"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
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
            <h2 id="impressum-title" className="font-display text-2xl font-bold tracking-tight text-white">
              Impressum
            </h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-ob-muted/60">Angaben gemäß § 5 TMG</p>
            <div className="mt-4 space-y-1 text-sm text-ob-muted">
              <p className="font-semibold text-white">Phillip Stockmann</p>
              <p>Stuttgart</p>
            </div>
            <div className="mt-4 text-sm text-ob-muted">
              <span className="font-medium text-white">E-Mail: </span>
              <a
                href="mailto:mail@phillip-stockmann.de"
                className="text-ob-accent hover:underline"
              >
                mail@phillip-stockmann.de
              </a>
            </div>
            <p className="mt-6 text-xs text-ob-muted/60">
              Diese Website ist ein Aprilscherz / eine Parodie und dient ausschließlich satirischen Zwecken.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-ob-border bg-ob-surface py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Schließen
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function UeberUnsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ueber-uns-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.button
            type="button"
            aria-label="Schließen"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-ob-accent-dim px-3 py-1 text-sm font-medium text-ob-accent">
              <Heart className="h-4 w-4" />
              Danke!
            </div>
            <h2 id="ueber-uns-title" className="font-display text-2xl font-bold tracking-tight text-white">
              Über uns
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ob-muted">
              Die Idee zu OnlyBuendisch.de ist an einem lustigen Abend auf der{' '}
              <span className="font-medium text-white">Burg Hohenkrähen</span> entstanden.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ob-muted">
              Ein besonderer Dank geht an die{' '}
              <span className="font-semibold text-ob-accent">Horte Albuesta</span>{' '}
              – ohne euch wäre das nie passiert. 🔥
            </p>
            <a
              href="https://burg.grauer-reiter.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-ob-accent py-3 text-sm font-semibold text-ob-bg transition hover:brightness-110"
            >
              Zur Burg Hohenkrähen
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-ob-border bg-ob-surface py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Schließen
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

/* APRILSCHERZ DEAKTIVIERT – AprilModal-Komponente auskommentiert
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
        <m.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="april-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.button
            type="button"
            aria-label="Schließen"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <m.div
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
            <div className="mt-8 flex flex-col gap-3">
              <a
                href="https://burg.grauer-reiter.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ob-accent py-3.5 text-sm font-semibold text-ob-bg transition hover:brightness-110 text-center"
              >
                Zur Realität
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-ob-border bg-ob-surface py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Schließen
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
APRILSCHERZ DEAKTIVIERT */

export default function App() {
  // APRILSCHERZ DEAKTIVIERT: const [modalOpen, setModalOpen] = useState(false)
  const [impressumOpen, setImpressumOpen] = useState(false)
  const [ueberUnsOpen, setUeberUnsOpen] = useState(false)
  // APRILSCHERZ DEAKTIVIERT: const modalRef = useRef<HTMLDivElement>(null)
  

  // Responsive counts removed (UI sections trimmed)

  // APRILSCHERZ DEAKTIVIERT – useEffect zum Aktivieren des AprilModals auskommentiert
  // useEffect(() => {
  //   const onClickCapture = (e: MouseEvent) => {
  //     if (modalOpen) return;
  //     if (modalRef.current?.contains(e.target as Node)) return;
  //     // Modal nicht öffnen, wenn auf ein Video oder Overlay davon geklickt wird
  //     let node = e.target as HTMLElement | null;
  //     while (node) {
  //       // Wenn ein Video-Element in der Kette ist, abbrechen
  //       if (node.tagName === 'VIDEO') return;
  //       // Wenn ein Overlay-Element (z.B. .aspect-video) ein Video enthält, abbrechen
  //       if (node.classList && node.classList.contains('aspect-video')) {
  //         if (node.querySelector('video')) return;
  //       }
  //       node = node.parentElement;
  //     }
  //     // Modal nur öffnen, wenn das Ziel im Haupt-Content liegt
  //     const mainContent = document.getElementById('main-content');
  //     if (!mainContent) return;
  //     if (!mainContent.contains(e.target as Node)) return;
  //     e.preventDefault();
  //     setModalOpen(true);
  //     if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
  //       window.plausible('aprilModalActivated');
  //     }
  //   };
  //   document.addEventListener('click', onClickCapture, true);
  //   return () => document.removeEventListener('click', onClickCapture, true);
  // }, [modalOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <div id="main-content" className="relative min-h-svh">
        <header className="sticky top-0 z-50 border-b border-ob-border/80 bg-ob-bg/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-8">
              <a
                href="/"
                className="transition hover:text-white"
              >
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  Only<span className="text-ob-accent">Buendisch</span>
                </span>
              </a>
              <nav className="hidden items-center gap-6 text-sm font-medium text-ob-muted md:flex">
                <a
                  href="https://ideas.onlybuendisch.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Ideensammlung
                </a>
                <a
                  href="/archive/"
                  className="transition hover:text-white"
                >
                  Aprilscherz-Archiv
                </a>
              </nav>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden border-b border-ob-border">
          <div className="absolute inset-0">
            <img
              src="/images/photo-1504280390367-361c6d9f38f4.jpg"
              alt=""
              className="h-full w-full object-cover opacity-40"
              fetchPriority="high"
              decoding="sync"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ob-bg via-ob-bg/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-ob-bg via-transparent to-ob-bg/40" />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:gap-12">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ob-border bg-ob-surface/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-ob-accent">
                <Star className="h-3.5 w-3.5" />
                Und was nun?
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                OnlyBuendisch.de war ein Aprilscherz!
              </h1>
              <p className="mt-4 text-lg text-ob-muted">
                Nun, da der 1. April 2026 vorbei ist, möchte ich euch allen dafür danken, dass ihr diesen Spaß mitgemacht habt. Über 250 Besucher aus ganz Europa haben OnlyBuendisch.de am 1. April besucht – und ich hoffe, ihr hattet genauso viel Spaß wie ich beim Erstellen dieser Seite! 😊
              </p>
              <p className="mt-4 text-lg text-ob-muted">
                Hiermit endet dieses Projekt - oder etwa nicht? 😉
              </p>
              <p className="mt-4 text-lg text-ob-muted">
                Ich möchte mit euch nun Ideen sammeln und diskutieren, ob und wie es mit OnlyBuendisch.de weitergehen könnte. Es gibt viele Möglichkeiten, von einem einmaligen Aprilscherz zu einer dauerhaften Plattform für Buendische Inhalte zu werden. Was denkt ihr? Habt ihr Ideen oder Wünsche?
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://ideas.onlybuendisch.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-ob-accent px-5 py-3 text-sm font-semibold text-ob-bg transition hover:brightness-110"
                >
                  <Flame className="h-4 w-4" />
                  Teilt eure Ideen!
                </a>
                <a
                  href="/archive/"
                  className="inline-flex items-center gap-2 rounded-xl border border-ob-border bg-ob-surface px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  <Play className="h-4 w-4" />
                  Aprilscherz-Archiv
                </a>
              </div>
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
                  webkit-playsinline="true"
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

      </div>

      <footer className="border-t border-ob-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <span className="font-display text-lg font-bold text-white">
            Only<span className="text-ob-accent">Buendisch</span>
          </span>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-ob-muted">
            <button type="button" onClick={() => { setUeberUnsOpen(true); if (typeof window !== 'undefined' && typeof window.plausible === 'function') { window.plausible('ueberUnsModalActivated'); } }} className="transition hover:text-white">
              Über uns
            </button>
            <span>Datenschutz</span>
            <button type="button" onClick={() => { setImpressumOpen(true); if (typeof window !== 'undefined' && typeof window.plausible === 'function') { window.plausible('impressumModalActivated'); } }} className="transition hover:text-white">
              Impressum
            </button>
            <span>Kontakt</span>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-ob-muted/60">
          © {new Date().getFullYear()} OnlyBuendisch · Parodie / Aprilscherz · jugendfrei & bündisch
        </p>
      </footer>

      {/* APRILSCHERZ DEAKTIVIERT
      <AprilModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        containerRef={modalRef}
      /> */}
      <ImpressumModal
        open={impressumOpen}
        onClose={() => setImpressumOpen(false)}
      />
      <UeberUnsModal
        open={ueberUnsOpen}
        onClose={() => setUeberUnsOpen(false)}
      />
    </LazyMotion>
  )
}
