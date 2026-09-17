import { Section, SectionHeading } from '@/components/layout/section'
import { FEATURES } from '@/data/features'
import { FeatureCard } from './feature-card'

export function FeaturesSection() {
  return (
    <Section id="features" tone="surface">
      <SectionHeading
        eyebrow="What it does"
        title="Three records. One honest number."
        description="Most stock tools stop at counting boxes. Aliran carries the cost of every movement through to the bottom line, so the profit you read is the profit you made."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} delay={index * 0.08} />
        ))}
      </div>
    </Section>
  )
}
