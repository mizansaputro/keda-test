import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderWithTheme } from '@/test/render-with-router'
import { ThemeToggle } from './theme-toggle'

const STORAGE_KEY = 'aliran-theme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('starts in light mode when the system does not prefer dark', async () => {
    renderWithTheme(<ThemeToggle />)
    await waitFor(() => expect(document.documentElement).not.toHaveClass('dark'))
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
  })

  it('adds the dark class to the document root when toggled', async () => {
    renderWithTheme(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
    expect(
      await screen.findByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument()
  })

  it('toggles back to light', async () => {
    renderWithTheme(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to light theme' }))

    await waitFor(() => expect(document.documentElement).not.toHaveClass('dark'))
  })

  it('persists the choice so it survives a reload', async () => {
    renderWithTheme(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    await waitFor(() => expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark'))
  })

  it('restores a stored preference on mount, ahead of the system setting', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'dark')
    renderWithTheme(<ThemeToggle />)

    await waitFor(() => expect(document.documentElement).toHaveClass('dark'))
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('sets color-scheme so browser UI matches the theme', async () => {
    renderWithTheme(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    await waitFor(() => expect(document.documentElement.style.colorScheme).toBe('dark'))
  })
})
