import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  linkedinLabel: string;
};

export function SiteFooter({ name, title, location, email, linkedin, linkedinLabel }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`site-container-wide ${styles.inner}`}>
        <p>
          {name} · {title} · {location}
        </p>
        <p className={styles.links}>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            {linkedinLabel}
          </a>
        </p>
      </div>
    </footer>
  );
}
