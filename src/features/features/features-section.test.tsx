import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FEATURES } from '@/data/features'
import { FeaturesSection } from './features-section'

describe('FeaturesSection', () => {
  it('renders one card per feature in the data, with no duplicates', () => {
    render(<FeaturesSection />)
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(FEATURES.map((feature) => feature.title))
  })

  it('covers the three capabilities the brief asks for', () => {
    render(<FeaturesSection />)
    expect(screen.getByRole('heading', { name: 'Incoming goods' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Outgoing goods' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Daily profit/ })).toBeInTheDocument()
  })

  it('shows each feature description and its supporting points', () => {
    render(<FeaturesSection />)
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.description)).toBeInTheDocument()
      for (const point of feature.points) {
        expect(screen.getByText(point)).toBeInTheDocument()
      }
    }
  })

  it('keeps each feature’s points inside its own card', () => {
    render(<FeaturesSection />)
    for (const feature of FEATURES) {
      const card = screen
        .getByRole('heading', { name: feature.title })
        .closest('[class*="rounded-2xl"]') as HTMLElement
      expect(card).not.toBeNull()
      for (const point of feature.points) {
        expect(within(card).getByText(point)).toBeInTheDocument()
      }
    }
  })

  it('renders the section under an addressable anchor for the navbar', () => {
    const { container } = render(<FeaturesSection />)
    expect(container.querySelector('section#features')).toBeInTheDocument()
  })
})
