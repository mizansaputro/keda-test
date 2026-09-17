import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppProviders } from '@/components/app-providers'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  )
}
