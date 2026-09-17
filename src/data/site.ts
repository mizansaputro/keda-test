/**
 * Global site metadata and navigation. Anything that appears in more than one
 * place (navbar + footer, hero + login panel) is defined here once.
 */

export interface NavLink {
  /** Visible label. Rendered uppercase by the navbar, matching the reference. */
  label: string
  /** In-page anchor target, e.g. `#pricing`. */
  hash: string
}

export const SITE = {
  name: 'Aliran',
  tagline: 'Know what moves, and what it earns.',
  description:
    'Aliran records every item that enters and leaves your warehouse, then turns those movements into a daily profit figure you can trust.',
  email: 'hello@aliran.id',
  phone: '+62 21 5089 4120',
  address: 'Jl. Casablanca Raya Kav. 88, Jakarta Selatan 12870, Indonesia',
} as const

export const NAV_LINKS: NavLink[] = [
  { label: 'About', hash: '#about' },
  { label: 'Pricing', hash: '#pricing' },
  { label: 'Contact', hash: '#contact' },
]

export const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Analytics', href: '#analytics' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Careers', href: '#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#features' },
      { label: 'Support', href: '#contact' },
      { label: 'Status', href: '#contact' },
    ],
  },
]
