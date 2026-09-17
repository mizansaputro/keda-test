import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom implements neither of these, and both are used by the UI layer
// (motion's reduced-motion query and scroll-spy / reveal observers).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: readonly number[] = []
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

window.IntersectionObserver = MockIntersectionObserver
globalThis.IntersectionObserver = MockIntersectionObserver

window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

// jsdom ships no canvas implementation and logs an "unimplemented" error for
// every call. The chart's colour bridge already falls back when it cannot get a
// 2D context, so hand it null instead of the noise.
HTMLCanvasElement.prototype.getContext = vi.fn(
  () => null,
) as unknown as typeof HTMLCanvasElement.prototype.getContext
