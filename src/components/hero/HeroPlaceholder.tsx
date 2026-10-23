import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight } from "@/components/ui/icons";
import { contactHref, site } from "@/lib/site";
import styles from "./HeroPlaceholder.module.css";

const pillars = [
  { index: "01", title: "Digital products", body: "From problem framing to shipped, usable software." },
  { index: "02", title: "Intelligent systems", body: "Automation and AI that remove friction from real workflows." },
  { index: "03", title: "Measurable growth", body: "Experiments and analytics tied to business outcomes." },
] as const;

/**
 * Static stand-in for the Stage 2 hero. The motion-graphics stage will mount
 * alongside this content, not inside it.
 */
export function HeroPlaceholder() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container>
        <Eyebrow dot>{site.role}</Eyebrow>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.lead}>I turn business problems into </span>
          digital products, intelligent systems, and measurable growth.
        </h1>

        <p className={styles.lede}>
          Hi, I’m {site.name}. I work where product, engineering, and growth meet: shaping what
          to build, building it, and proving that it works.
        </p>

        <div className={styles.actions}>
          <Button href="#work" size="lg" icon={<ArrowRight />}>
            View selected work
          </Button>
          <Button href={contactHref} size="lg" variant="secondary">
            Get in touch
          </Button>
        </div>

        <GlassPanel className={styles.pillars} padding="none" radius="xl">
          <ul className={styles.pillarList}>
            {pillars.map((pillar) => (
              <li key={pillar.index} className={styles.pillar}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <h2 className={styles.pillarTitle}>{pillar.title}</h2>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </Container>
    </section>
  );
}
