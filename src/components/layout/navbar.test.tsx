import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { NAV_LINKS } from '@/data/site'
import { renderWithRouter } from '@/test/render-with-router'
import { Navbar } from './navbar'

describe('Navbar', () => {
  it('renders one anchor per configured section link', async () => {
    renderWithRouter(<Navbar />)
    const nav = await screen.findByRole('navigation', { name: 'Main' })

    for (const link of NAV_LINKS) {
      const anchor = screen.getAllByRole('link', { name: link.label })[0]
      expect(anchor).toHaveAttribute('href', link.hash)
      expect(nav).toContainElement(anchor)
    }
  })

  it('points the login control at the /login route', async () => {
    renderWithRouter(<Navbar />)
    const login = (await screen.findAllByRole('link', { name: 'Login' }))[0]
    expect(login).toHaveAttribute('href', '/login')
  })

  it('exposes a labelled brand link back to the top', async () => {
    renderWithRouter(<Navbar />)
    expect(await screen.findByRole('link', { name: /home/i })).toHaveAttribute('href', '#hero')
  })

  it('keeps the mobile menu closed initially', async () => {
    renderWithRouter(<Navbar />)
    const trigger = await screen.findByRole('button', { name: 'Open menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument()
  })

  it('opens the mobile menu and exposes the same links', async () => {
    renderWithRouter(<Navbar />)
    await userEvent.click(await screen.findByRole('button', { name: 'Open menu' }))

    const trigger = screen.getByRole('button', { name: 'Close menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const menu = document.getElementById('mobile-menu')
    expect(menu).toBeInTheDocument()
    // aria-controls must resolve to the element it names.
    expect(trigger).toHaveAttribute('aria-controls', 'mobile-menu')

    for (const link of NAV_LINKS) {
      expect(screen.getAllByRole('link', { name: link.label })).toHaveLength(2)
    }
  })

  it('locks page scroll while the menu is open and restores it after', async () => {
    renderWithRouter(<Navbar />)
    await userEvent.click(await screen.findByRole('button', { name: 'Open menu' }))
    expect(document.body.style.overflow).toBe('hidden')

    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    await waitFor(() => expect(document.body.style.overflow).toBe(''))
  })

  it('closes the menu when a section link is chosen', async () => {
    renderWithRouter(<Navbar />)
    await userEvent.click(await screen.findByRole('button', { name: 'Open menu' }))

    const menu = document.getElementById('mobile-menu') as HTMLElement
    const [aboutLink] = Array.from(menu.querySelectorAll('a')).filter(
      (anchor) => anchor.textContent === 'About',
    )
    await userEvent.click(aboutLink)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })
  })

  it('closes the menu on Escape and returns focus to the trigger', async () => {
    renderWithRouter(<Navbar />)
    const trigger = await screen.findByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)
    expect(document.getElementById('mobile-menu')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })
    // Focus must not be left orphaned on a removed element.
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('marks no link as current until a section is in view', async () => {
    // The IntersectionObserver stub reports nothing, which is the same state as
    // sitting at the top of the page above every tracked section.
    renderWithRouter(<Navbar />)
    await screen.findByRole('navigation', { name: 'Main' })
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(0)
  })

  it('offers a theme switch', async () => {
    renderWithRouter(<Navbar />)
    expect(await screen.findByRole('button', { name: /switch to (light|dark) theme/i })).toBeInTheDocument()
  })
})
