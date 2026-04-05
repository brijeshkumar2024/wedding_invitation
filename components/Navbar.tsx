"use client";

type NavbarProps = {
  musicEnabled: boolean;
  onToggleMusic: () => void;
};

const navItems = [
  { label: "STORY", id: "story" },
  { label: "TIMELINE", id: "timeline" },
  { label: "VENUE", id: "venue" },
  { label: "RSVP", id: "rsvp" }
];

export default function Navbar(props: Readonly<NavbarProps>) {
  const { musicEnabled, onToggleMusic } = props;

  return (
    <nav className="fixed left-1/2 top-5 z-40 w-[92%] max-w-6xl -translate-x-1/2 rounded-full border border-white/15 bg-black/35 px-4 py-3 shadow-[0_20px_65px_rgba(0,0,0,0.55)] backdrop-blur-2xl animate-[fadeInDown_1.1s_ease_forwards]">
      <div className="flex items-center justify-between gap-4">
        <a href="#hero" className="font-heading text-sm tracking-[0.35em] text-[#D4AF37]">R & A</a>
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="text-xs tracking-[0.22em] text-white/80 transition hover:text-[#D4AF37]">
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleMusic}
          className="group relative overflow-hidden rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs tracking-[0.25em] text-white/90 backdrop-blur-xl"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-[#D4AF37]/25 to-transparent transition duration-700 group-hover:translate-x-full" />
          <span className="relative">{musicEnabled ? "SOUND ON" : "SOUND OFF"}</span>
        </button>
      </div>
    </nav>
  );
}
