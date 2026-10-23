import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/lib/site";
import { Container } from "./Container";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Container size="wide" className={styles.inner}>
        <p className={styles.identity}>
          <span className={styles.name}>{site.name}</span>
          <span className={styles.role}>{site.role}</span>
        </p>
        <TextLink href="#top" tone="muted" className={styles.top}>
          Back to top
        </TextLink>
      </Container>
    </footer>
  );
}
