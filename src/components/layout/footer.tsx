import { Container } from './container'
import { Logo } from './logo'
import { FOOTER_LINKS, SITE } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-muted-foreground text-pretty">
              {SITE.description}
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. Built as a frontend coding assignment.
          </p>
          <p className="text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>
      </Container>
    </footer>
  )
}
