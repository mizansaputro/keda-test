import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PRICING_TIERS, formatPrice } from '@/data/pricing'
import { PricingSection } from './pricing-section'

describe('PricingSection', () => {
  it('renders every tier defined in the data, in order', () => {
    render(<PricingSection />)
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(headings).toEqual(PRICING_TIERS.map((tier) => tier.name))
  })

  it('covers the three tiers named in the brief', () => {
    render(<PricingSection />)
    for (const name of ['Basic', 'Business', 'Entrepreneur']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument()
    }
  })

  it('shows monthly prices first', () => {
    render(<PricingSection />)
    for (const tier of PRICING_TIERS) {
      expect(screen.getByText(formatPrice(tier.price.monthly))).toBeInTheDocument()
    }
  })

  it('keeps exactly one price visible per card while the figures cross-fade', async () => {
    render(<PricingSection />)
    await userEvent.click(screen.getByRole('switch', { name: /annually/i }))

    await waitFor(() => {
      // A stuck exit animation would leave two figures stacked in a card.
      expect(screen.getAllByText(/^Rp \d+k$/)).toHaveLength(PRICING_TIERS.length)
    })
  })

  it('swaps every price when annual billing is selected', async () => {
    render(<PricingSection />)
    const toggle = screen.getByRole('switch', { name: /annually/i })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-checked', 'true')
    // Prices cross-fade, so the old figure is still on its way out.
    for (const tier of PRICING_TIERS) {
      expect(await screen.findByText(formatPrice(tier.price.annual))).toBeInTheDocument()
    }
    await waitFor(() => {
      for (const tier of PRICING_TIERS) {
        expect(screen.queryByText(formatPrice(tier.price.monthly))).not.toBeInTheDocument()
      }
    })
  })

  it('switches back to monthly', async () => {
    render(<PricingSection />)
    const toggle = screen.getByRole('switch', { name: /annually/i })
    await userEvent.click(toggle)
    await userEvent.click(toggle)
    expect(
      await screen.findByText(formatPrice(PRICING_TIERS[0].price.monthly)),
    ).toBeInTheDocument()
  })

  it('flags exactly one tier as most popular', () => {
    render(<PricingSection />)
    expect(screen.getAllByText('Most popular')).toHaveLength(1)
  })

  it('puts the popular ribbon on the Business card specifically', () => {
    render(<PricingSection />)
    const card = screen
      .getByRole('heading', { level: 3, name: 'Business' })
      .closest('[class*="rounded-2xl"]')
    expect(card).not.toBeNull()
    expect(within(card as HTMLElement).getByText('Most popular')).toBeInTheDocument()
  })

  it('lists each tier feature and its call to action', () => {
    render(<PricingSection />)
    for (const tier of PRICING_TIERS) {
      expect(screen.getByRole('link', { name: tier.cta })).toBeInTheDocument()
      for (const feature of tier.features) {
        expect(screen.getByText(feature)).toBeInTheDocument()
      }
    }
  })

  it('states what the higher tiers inherit rather than repeating the list', () => {
    render(<PricingSection />)
    expect(screen.getByText('Everything in Basic, plus:')).toBeInTheDocument()
    expect(screen.getByText('Everything in Business, plus:')).toBeInTheDocument()
  })
})
