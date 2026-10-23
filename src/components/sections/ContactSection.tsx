"use client";

import React, { useState } from "react";
import { siteProfile } from "@/lib/portfolio-data";
import styles from "./ContactSection.module.css";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const subject = encodeURIComponent(
      `Portfolio Inquiry from ${name || "Prospective Collaborator"}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nProject / Role Details:\n${scope}`
    );
    window.location.href = `mailto:${siteProfile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Direct Channels */}
          <div className={styles.leftCol}>
            <div className={styles.eyebrow}>Get in Touch</div>
            <h2 id="contact-title" className={styles.title}>
              Let&apos;s build something that moves the numbers.
            </h2>
            <p className={styles.subtitle}>
              Available for full-time Growth / Digital Marketing roles, SEO &amp; paid media
              consulting, and no-code AI / CRM automation projects in Bengaluru or remote.
            </p>

            <div className={styles.channelsList}>
              <a href={`mailto:${siteProfile.email}`} className={styles.channelItem}>
                <div>
                  <span className={styles.channelLabel}>Email</span>
                  <span className={styles.channelValue}>{siteProfile.email}</span>
                </div>
                <span className={styles.channelArrow}>→</span>
              </a>

              <a href="tel:+919620759032" className={styles.channelItem}>
                <div>
                  <span className={styles.channelLabel}>Phone &amp; WhatsApp</span>
                  <span className={styles.channelValue}>
                    {siteProfile.phone} · Bengaluru, India
                  </span>
                </div>
                <span className={styles.channelArrow}>→</span>
              </a>

              <a
                href={siteProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelItem}
              >
                <div>
                  <span className={styles.channelLabel}>LinkedIn</span>
                  <span className={styles.channelValue}>{siteProfile.linkedinDisplay}</span>
                </div>
                <span className={styles.channelArrow}>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Message Form */}
          <div className={styles.rightCol}>
            <div className={styles.formBox}>
              <div className={styles.formHeader}>
                <span>Send a Direct Message</span>
                <span className={styles.acidText}>{siteProfile.email}</span>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputRow2}>
                  <div>
                    <label htmlFor="contact-name" className={styles.inputLabel}>
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={styles.inputLabel}>
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-scope" className={styles.inputLabel}>
                    How can I help?
                  </label>
                  <textarea
                    id="contact-scope"
                    rows={4}
                    placeholder="Tell me about the role, growth goal, or marketing system you are building..."
                    required
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.submitRow}>
                  <span className={styles.turnaroundNote}>
                    Replies within 24 hours · Bengaluru, KA
                  </span>
                  <button type="submit" className={styles.submitBtn}>
                    <span>Send Message</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                {submitted && (
                  <div className={styles.successBanner}>
                    Opening your email client to message {siteProfile.email}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
