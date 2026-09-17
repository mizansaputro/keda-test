import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Check } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { GradientWave } from '@/features/hero/gradient-wave'
import { SITE } from '@/data/site'
import { LoginForm } from './login-form'

const HIGHLIGHTS = [
  'Every movement, costed as it happens',
  'Daily profit without a spreadsheet',
  'Charts and Excel export on higher tiers',
]

export function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel. Reuses the hero artwork so the two pages read as one
          product; hidden below lg where it would only push the form down. */}
      {/* The panel sits on a solid brand gradient, with the hero wave layered
          over it for depth. Relying on the wave alone left the white copy on
          its pale areas with almost no contrast. */}
      <aside className="relative hidden overflow-hidden bg-gradient-brand lg:block">
        <GradientWave className="absolute inset-0 scale-150 opacity-45" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-headline font-extrabold text-white drop-shadow-sm"
            >
              {SITE.tagline}
            </motion.h2>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 space-y-3"
            >
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/25">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to site
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"
        >
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-headline font-extrabold text-foreground lg:mt-0">
            Welcome back
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to pick up where your last stock count left off.
          </p>

          <div className="mt-9">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            No account yet?{' '}
            <Link
              to="/"
              hash="pricing"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              See the plans
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
