import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldError } from '@/components/ui/field'
import { Reveal } from '@/components/layout/reveal'
import { Section, SectionHeading } from '@/components/layout/section'
import { SITE } from '@/data/site'
import { collectErrors, validateEmail, validateRequired } from '@/lib/validation'

const CHANNELS = [
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
  { icon: MapPin, label: 'Office', value: SITE.address },
]

type ContactField = 'name' | 'email' | 'message'

export function ContactSection() {
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({})
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    const nextErrors = collectErrors<ContactField>({
      name: validateRequired(name, 'Name'),
      email: validateEmail(email),
      message: validateRequired(message, 'Message'),
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // No backend in this assignment: the submission is acknowledged locally.
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <Section id="contact" tone="surface">
      <SectionHeading
        eyebrow="Contact"
        title="Tell us what you are tracking."
        description="Send a note and someone from the team will reply within one business day. No sales sequence, no demo gauntlet."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon
            const content = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {channel.label}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">
                    {channel.value}
                  </span>
                </span>
              </>
            )

            return (
              <Card key={channel.label} interactive={Boolean(channel.href)} className="p-5">
                {channel.href ? (
                  <a href={channel.href} className="flex items-start gap-4 rounded-lg">
                    {content}
                  </a>
                ) : (
                  <div className="flex items-start gap-4">{content}</div>
                )}
              </Card>
            )
          })}
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="p-7 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Rina Prasetyo"
                  error={errors.name}
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  error={errors.email}
                />
              </div>

              <div>
                <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="We run three outlets and currently reconcile stock by hand…"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={
                    'w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm text-foreground ' +
                    'placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] ' +
                    'focus-visible:outline-none focus-visible:border-primary ' +
                    'focus-visible:ring-2 focus-visible:ring-primary/25 ' +
                    (errors.message ? 'border-destructive' : 'border-input hover:border-border-strong')
                  }
                />
                </div>
                <FieldError id="contact-message-error">{errors.message}</FieldError>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button type="submit" variant="gradient" size="lg">
                  Send message
                </Button>
                <AnimatePresence>
                  {sent && (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                      Thanks — we will be in touch shortly.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
