import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/layout/reveal'
import { ABOUT_STATS } from '@/data/analytics'

export function AboutSection() {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow text-primary">About us</p>
          <h2 className="mt-4 text-headline font-bold text-foreground">
            Built for the people counting stock at closing time.
          </h2>
          <div className="mt-6 space-y-5 text-lead text-muted-foreground text-pretty">
            <p>
              Aliran started in a Jakarta distribution warehouse in 2019. The owner knew his
              shelves and he knew his bank balance, but the two never quite reconciled — the
              answer was always a month late and a spreadsheet away.
            </p>
            <p>
              We built the thing he actually needed: record what comes in, record what goes out,
              and let the software do the arithmetic. Everything since has been in service of that
              one loop, and we have said no to a lot of features that would have blurred it.
            </p>
          </div>

          {/* The italic pull-quote from the reference design. */}
          <blockquote className="mt-9 border-l-2 border-primary pl-6">
            <p className="font-display text-lg italic text-foreground text-pretty">
              “We stopped guessing at the end of the month. Now the number is just there when we
              close up.”
            </p>
            <footer className="mt-3 text-sm text-muted-foreground">
              Rina Prasetyo — Operations Lead, Toko Berkah Jaya
            </footer>
          </blockquote>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border">
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} className="bg-card p-7 sm:p-9">
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="mt-2 font-display text-3xl font-extrabold tracking-tight tabular-nums text-gradient-brand sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
