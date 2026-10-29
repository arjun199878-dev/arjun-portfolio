"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "../motion/Reveal";
import { Button } from "../ui/Button";
import styles from "./Contact.module.css";

type ContactProps = {
  headline: string;
  intro: string;
  replyNote: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  linkedin: string;
  labels: {
    emailCta: string;
    whatsappLabel: string;
    linkedinLabel: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
  };
};

export function Contact({ headline, intro, replyNote, email, phoneDisplay, phoneHref, whatsappHref, linkedin, labels }: ContactProps) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "your website"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${from}\n\n${message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="site-container">
        <Reveal className={styles.head}>
          <h2 id="contact-title" className={styles.title}>
            {headline}
          </h2>
          <p className={styles.intro}>{intro}</p>
          <div className={styles.cta}>
            <Button href={`mailto:${email}`} variant="primary">
              {labels.emailCta}
            </Button>
          </div>
          <div className={styles.links}>
            {whatsappHref ? (
              <Button href={whatsappHref} variant="link" external>
                {labels.whatsappLabel}
              </Button>
            ) : null}
            {phoneHref ? (
              <Button href={phoneHref} variant="link">
                {phoneDisplay}
              </Button>
            ) : null}
            {linkedin ? (
              <Button href={linkedin} variant="link" external>
                {labels.linkedinLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>
        <Reveal className={styles.formWrap}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{labels.formName}</span>
              <input className={styles.input} type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{labels.formEmail}</span>
              <input className={styles.input} type="email" name="email" value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="email" required />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{labels.formMessage}</span>
              <textarea className={`${styles.input} ${styles.textarea}`} name="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
            </label>
            <div>
              <button type="submit" className={styles.submit}>
                {labels.formSubmit}
              </button>
            </div>
            <p className={styles.note}>{replyNote}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
