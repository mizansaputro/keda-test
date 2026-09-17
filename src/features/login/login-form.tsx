import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { collectErrors, validateEmail, validatePassword } from '@/lib/validation'

type LoginField = 'email' | 'password'
type Status = 'idle' | 'submitting' | 'success'

/**
 * Frontend-only sign-in. There is no auth API in this assignment, so a valid
 * submission resolves to a success state after a short simulated round trip —
 * enough to demonstrate validation, pending UI and feedback.
 */
export function LoginForm() {
  const [errors, setErrors] = useState<Partial<Record<LoginField, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')

    const nextErrors = collectErrors<LoginField>({
      email: validateEmail(email),
      password: validatePassword(password),
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    window.setTimeout(() => setStatus('success'), 700)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email}
      />

      <Field
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="At least 8 characters"
        error={errors.password}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="size-4 rounded border-input accent-[var(--primary)]"
          />
          Remember me
        </label>
        <a
          href="#"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={(event) => event.preventDefault()}
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.2, ease: 'linear' },
            }}
            className="overflow-hidden"
          >
            <p
              role="status"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Signed in. This demo has no dashboard behind it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
