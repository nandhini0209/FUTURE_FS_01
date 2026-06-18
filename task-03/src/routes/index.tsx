import { createFileRoute } from "@tanstack/react-router";
import heroPasta from "@/assets/hero-pasta.jpg";
import chefImg from "@/assets/chef.jpg";
import galleryWine from "@/assets/gallery-wine.jpg";
import galleryFire from "@/assets/gallery-fire.jpg";
import gallerySpace from "@/assets/gallery-space.jpg";
import galleryOil from "@/assets/gallery-oil.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olive & Ember — A West Village Trattoria" },
      {
        name: "description",
        content:
          "A neighborhood trattoria in the West Village dedicated to wood-fired hearth cooking, hand-rolled pasta, and slow evenings. Reservations open nightly.",
      },
      { property: "og:title", content: "Olive & Ember — A West Village Trattoria" },
      {
        property: "og:description",
        content:
          "Wood-fired hearth cooking and hand-rolled pasta in the heart of the West Village.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroPasta },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroPasta },
    ],
  }),
  component: Home,
});

const menuItems = [
  {
    name: "Cacio e Pepe al Tartufo",
    desc: "Hand-cut tonnarelli, Pecorino Romano, toasted black pepper, shaved seasonal truffle.",
    price: "$32",
  },
  {
    name: "Wood-Fired Branzino",
    desc: "Whole Mediterranean sea bass, blistered cherry tomatoes, lemon-thyme salsa verde.",
    price: "$46",
  },
  {
    name: "Burrata & Charred Peach",
    desc: "Local burrata, wood-grilled stone fruit, 25-year aged balsamic, micro-basil.",
    price: "$24",
  },
  {
    name: "Wild Boar Pappardelle",
    desc: "12-hour ragù, hand-cut ribbons, 36-month aged Parmigiano-Reggiano.",
    price: "$34",
  },
];

const gallery = [
  { src: galleryWine, alt: "Red wine being poured into a crystal glass", label: "Ambience" },
  { src: galleryFire, alt: "Sourdough pizza in a wood-fired oven", label: "Fire" },
  { src: gallerySpace, alt: "Warmly lit trattoria interior", label: "Space" },
  { src: galleryOil, alt: "Bowl of olive oil with rosemary", label: "Detail" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-12">
          <a href="#top" className="font-display text-2xl tracking-tight">
            Olive &amp; Ember
          </a>
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            <a href="#menu" className="hover:text-primary transition-colors">The Menu</a>
            <a href="#story" className="hover:text-primary transition-colors">Our Story</a>
            <a href="#gallery" className="hover:text-primary transition-colors">Gallery</a>
          </div>
        </div>
        <a
          href="#reserve"
          className="px-5 py-2.5 bg-foreground text-background text-[11px] uppercase tracking-widest font-medium hover:bg-primary transition-all"
        >
          Reservations
        </a>
      </nav>

      {/* Hero */}
      <header id="top" className="relative h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroPasta}
            alt="Hand-torn pappardelle on flour-dusted marble"
            width={1920}
            height={1080}
            className="w-full h-full object-cover scale-105 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        </div>
        <div className="relative z-10 text-center max-w-4xl animate-reveal">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-6 block">
            West Village • NYC
          </span>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl mb-8 text-balance leading-[0.9]">
            Slow food for <span className="italic font-medium">quiet</span> nights.
          </h1>
          <div className="flex justify-center">
            <p className="max-w-md text-sm md:text-base text-muted-foreground text-pretty leading-relaxed">
              A neighborhood trattoria dedicated to the ritual of wood-fired hearth cooking and hand-rolled pasta.
            </p>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-foreground/20" />
        </div>
      </header>

      {/* Story */}
      <section
        id="story"
        className="py-24 md:py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-center"
      >
        <div className="md:col-span-5 order-2 md:order-1">
          <img
            src={chefImg}
            alt="Chef Marco Rossi in the kitchen"
            width={1080}
            height={1344}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover rounded-sm"
          />
        </div>
        <div className="md:col-span-7 order-1 md:order-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 block">
            01 / Origins
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-8 leading-tight">
            From the ember,
            <br />
            <span className="italic">the flavor blooms.</span>
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed max-w-xl">
            <p>
              Founded by Marco Rossi, Olive &amp; Ember is a love letter to the rustic kitchens of
              Emilia-Romagna. We believe in the friction of the stone, the heat of the oak, and the
              patience of the ferment.
            </p>
            <p>
              Our ingredients are sourced from small-scale growers who respect the seasons as much
              as we do. No shortcuts, just the honest alchemy of flour, water, and fire.
            </p>
          </div>
          <div className="mt-12 pt-12 border-t border-border">
            <div className="font-mono text-[10px] uppercase tracking-widest">Open Nightly</div>
            <div className="text-2xl font-display mt-2">5:30 PM — Late</div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-24 md:py-32 bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20 md:mb-24">
            <h2 className="font-display text-5xl md:text-7xl italic mb-4">Signature Plates</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Selected highlights from tonight's menu
            </p>
          </div>

          <div className="space-y-12">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col md:flex-row md:items-end justify-between border-b border-background/10 pb-8 transition-colors hover:border-primary"
              >
                <div className="max-w-md">
                  <h3 className="font-display text-3xl mb-2">{item.name}</h3>
                  <p className="text-xs text-background/60 italic">{item.desc}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="hidden md:block flex-grow border-b border-dotted border-background/20 min-w-[100px]" />
                  <span className="font-mono text-sm">{item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button
              type="button"
              className="font-mono text-[11px] uppercase tracking-[0.2em] border border-background/20 px-8 py-4 hover:bg-background hover:text-foreground transition-all cursor-pointer"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-24 md:py-32 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {gallery.map((g, i) => (
            <div
              key={g.label}
              className={`aspect-square md:aspect-[3/4] overflow-hidden ${
                i % 2 === 1 ? "md:mt-12" : ""
              }`}
            >
              <img
                src={g.src}
                alt={g.alt}
                width={800}
                height={1024}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reservations */}
      <footer id="reserve" className="bg-cream border-t border-border py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <h2 className="font-display text-5xl md:text-6xl mb-12">
              Join us <span className="italic">tonight.</span>
            </h2>
            <div className="space-y-8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Location
                </span>
                <p className="text-xl">
                  242 Bleecker Street,
                  <br />
                  New York, NY 10014
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Contact
                </span>
                <p className="text-xl">
                  +1 (212) 555-0198
                  <br />
                  ciao@oliveandember.com
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Hours
                </span>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base max-w-sm">
                  <span>Tue – Thu</span><span className="text-muted-foreground">5:30pm – 10pm</span>
                  <span>Fri – Sat</span><span className="text-muted-foreground">5:30pm – 11pm</span>
                  <span>Sunday</span><span className="text-muted-foreground">5pm – 9pm</span>
                  <span>Monday</span><span className="text-muted-foreground">Closed</span>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you — we'll confirm your reservation by email shortly.");
            }}
            className="bg-background p-8 md:p-12 border border-border shadow-sm h-fit"
          >
            <div className="space-y-6">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Guest Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-lg bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                    Party Size
                  </label>
                  <select className="w-full border-b border-border py-2 focus:outline-none focus:border-primary transition-colors bg-transparent">
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    defaultValue="19:30"
                    className="w-full border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-lg bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-lg bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-foreground text-background py-5 uppercase tracking-[0.2em] font-medium text-[11px] hover:bg-primary transition-all mt-6"
              >
                Request a Table
              </button>
            </div>
          </form>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <p>&copy; 2026 Olive &amp; Ember Trattoria</p>
          <p>Photography by Studio Terra</p>
          <p>Made in New York</p>
        </div>
      </footer>
    </div>
  );
}
