import type { ReactNode } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { AppProviders } from '@/components/app-providers'

/**
 * Renders a component that depends on router context (anything using `Link`).
 * A throwaway two-route tree mirrors the real app's `/` and `/login` so link
 * targets resolve, without pulling in the whole generated route tree.
 */
export function renderWithRouter(ui: ReactNode): RenderResult {
  const rootRoute = createRootRoute()

  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <AppProviders>{ui}</AppProviders>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/login',
      component: () => <div>login route</div>,
    }),
  ])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(<RouterProvider router={router} />)
}

/** Renders a component through the app's real provider stack, without a router. */
export function renderWithTheme(ui: ReactNode): RenderResult {
  return render(<AppProviders>{ui}</AppProviders>)
}
