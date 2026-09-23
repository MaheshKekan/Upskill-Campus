import { Link, useLocation } from 'wouter';
import { Compass, LayoutDashboard, ListChecks, LogIn, Menu, Star, Store, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export function BrandMark() {
  return <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><span className="font-display text-xl leading-none">S</span></span>;
}

export function MarketplaceShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: 'Discover', icon: Compass },
    { href: '/browse', label: 'Browse providers', icon: Store },
    { href: '/orders', label: 'Your bookings', icon: ListChecks },
  ];
  return (
    <div className="grain page-shell">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container-page flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
            <BrandMark />
            <span className="font-display text-[1.15rem] font-bold tracking-tight">Service<span className="text-primary">.</span></span>
          </Link>
          <nav className="desktop-only flex items-center gap-7" aria-label="Primary">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link flex items-center gap-2 ${location === href ? 'active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={16} strokeWidth={1.8} />{label}</Link>)}
            <span className="h-5 w-px bg-border" />
            <Link href="/merchant-dashboard" className="nav-link flex items-center gap-2" data-testid="link-merchant-dashboard"><LayoutDashboard size={16} strokeWidth={1.8} />For providers</Link>
            <Link href="/sign-in" className="button-primary py-2.5" data-testid="link-sign-in"><LogIn size={16} />Sign in</Link>
          </nav>
          <button className="button-ghost md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu" data-testid="button-open-menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="container-page flex flex-col gap-3">
            {links.map(({ href, label }) => <Link key={href} href={href} className="nav-link py-2" onClick={() => setOpen(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
            <Link href="/merchant-dashboard" className="nav-link py-2" onClick={() => setOpen(false)} data-testid="link-mobile-dashboard">For providers</Link>
            <Link href="/sign-in" className="button-primary mt-1" onClick={() => setOpen(false)} data-testid="link-mobile-sign-in">Sign in</Link>
          </div>
        </div>}
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-border/70 py-10">
        <div className="container-page flex flex-col justify-between gap-5 text-sm text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-foreground"><BrandMark /><span>Good work, close by.</span></div>
          <div className="flex gap-5"><Link href="/merchant-onboarding" className="hover:text-foreground" data-testid="link-footer-onboarding">Become a provider</Link><Link href="/admin" className="hover:text-foreground" data-testid="link-footer-admin">Admin</Link></div>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-3">{eyebrow}</p><h1 className="font-display text-4xl font-bold tracking-[-.035em] md:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}</div>{action}</div>;
}

export function LoadingBlocks({ count = 3 }: { count?: number }) {
  return <div className="grid gap-5 md:grid-cols-3">{Array.from({ length: count }).map((_, i) => <div className="surface overflow-hidden p-4" key={i}><div className="skeleton h-44 w-full" /><div className="skeleton mt-4 h-5 w-3/4" /><div className="skeleton mt-3 h-4 w-1/2" /></div>)}</div>;
}

export function QueryState({ loading, error, empty, children, onRetry }: { loading?: boolean; error?: boolean; empty?: boolean; children: ReactNode; onRetry?: () => void }) {
  if (loading) return <LoadingBlocks />;
  if (error) return <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center"><p className="eyebrow">A small detour</p><h3 className="mt-2 font-display text-2xl font-bold">We couldn’t load that just now.</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">Give it another try. Your place is saved.</p><button className="button-secondary mt-5" onClick={onRetry} data-testid="button-retry">Try again</button></div>;
  if (empty) return <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"><Compass size={21} /></div><h3 className="font-display text-2xl font-bold">Nothing here yet</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">When there’s something to show, it’ll find its way here.</p></div>;
  return <>{children}</>;
}

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return <span className="inline-flex items-center gap-1 text-sm" data-testid="rating-summary"><Star size={14} className="text-accent" fill="currentColor" /><b>{rating.toFixed(1)}</b>{count !== undefined && <span className="text-muted-foreground">({count})</span>}</span>;
}

export function MerchantCard({ merchant }: { merchant: any }) {
  return <Link href={`/merchant/${merchant.slug}`} className="surface group block overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-md" data-testid={`card-merchant-${merchant.id}`}>
    <div className="relative h-52 overflow-hidden bg-secondary">{merchant.imageUrl ? <img className="image-cover transition-transform duration-500 group-hover:scale-105" src={merchant.imageUrl} alt="" /> : <div className="flex h-full items-center justify-center bg-secondary text-secondary-foreground"><Store size={32} strokeWidth={1.2} /></div>}
      {merchant.featured && <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground">Featured nearby</span>}
    </div>
    <div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow text-[.62rem]">{merchant.category}</p><h3 className="mt-1 font-display text-2xl font-bold">{merchant.name}</h3></div><StarRating rating={merchant.rating} count={merchant.reviewCount} /></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{merchant.tagline || merchant.location}</p><div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground"><span>{merchant.location}</span>{merchant.startingPrice !== undefined && <span>From <b className="text-foreground">${merchant.startingPrice}</b></span>}</div></div>
  </Link>;
}

export function OrderStatus({ status }: { status: string }) {
  return <span className={`status-pill status-${status}`} data-testid={`status-order-${status}`}>{status}</span>;
}