import { useState, useContext } from "react";
import { MdAttachEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { db, addDoc, collection } from "./firebase"; // Import Firebase config
import "./contact.css";
import toast, { Toaster } from 'react-hot-toast';
import ThemeContext from '../../Components/custom/Theme';
import { useFeatureSettings } from "../../config/FeatureSettingsContext";

const contactDraftKey = "avj-contact-draft";
const emptyFormData = { name: "", email: "", message: "" };
const commonEmailDomains = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
];
const knownEmailDomainTypos = {
  "gmal.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.comm": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmail.om": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmaol.com": "gmail.com",
  "gmoil.com": "gmail.com",
  "gmol.com": "gmail.com",
  "gmolil.com": "gmail.com",
  "gmaul.com": "gmail.com",
};

const getEmailDomainError = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const emailParts = normalizedEmail.split("@");
  if (emailParts.length !== 2 || !emailParts[0] || !emailParts[1]) {
    return "Enter a complete email address.";
  }

  const [localPart, domain] = emailParts;
  if (
    localPart.length > 64 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart) ||
    !/^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)
  ) {
    return "Enter a valid email domain.";
  }

  const knownTypoCorrection = knownEmailDomainTypos[domain];
  if (knownTypoCorrection) {
    return `That domain looks incorrect. Did you mean ${knownTypoCorrection}?`;
  }

  const closestCommonDomain = commonEmailDomains
    .map((knownDomain) => ({
      domain: knownDomain,
      distance: damerauLevenshteinDistance(domain, knownDomain),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (closestCommonDomain && closestCommonDomain.distance <= 2 && domain !== closestCommonDomain.domain) {
    return `That domain looks incorrect. Did you mean ${closestCommonDomain.domain}?`;
  }

  return "";
};

const damerauLevenshteinDistance = (first, second) => {
  const distances = Array.from(
    { length: first.length + 1 },
    (_, row) => Array.from({ length: second.length + 1 }, (_, column) => (
      row === 0 ? column : column === 0 ? row : 0
    ))
  );

  for (let row = 1; row <= first.length; row += 1) {
    for (let column = 1; column <= second.length; column += 1) {
      const substitutionCost = first[row - 1] === second[column - 1] ? 0 : 1;
      distances[row][column] = Math.min(
        distances[row - 1][column - 1] + substitutionCost,
        distances[row][column - 1] + 1,
        distances[row - 1][column] + 1,
        row > 1 && column > 1
          && first[row - 1] === second[column - 2]
          && first[row - 2] === second[column - 1]
          ? distances[row - 2][column - 2] + 1
          : Number.POSITIVE_INFINITY
      );
    }
  }
  return distances[first.length][second.length];
};

function Contact() {
  const { theme } = useContext(ThemeContext);
  const featureSettings = useFeatureSettings() || {};

  const [formData, setFormData] = useState(() => ({
    ...emptyFormData,
    ...(() => {
      try {
        return JSON.parse(localStorage.getItem(contactDraftKey)) || {};
      } catch {
        return {};
      }
    })(),
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shakeEmail, setShakeEmail] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const nextFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(nextFormData);
    if (e.target.name === "email") {
      setEmailError("");
      setShakeEmail(false);
    }
    localStorage.setItem(contactDraftKey, JSON.stringify(nextFormData));
  };

  // Handle form submission
// Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextEmailError = getEmailDomainError(formData.email);
    if (nextEmailError) {
      setEmailError(nextEmailError);
      setShakeEmail(false);
      window.setTimeout(() => setShakeEmail(true), 0);
      return;
    }

    setIsSubmitting(true);
    try {
      const notificationStyle = theme === "dark"
        ? { backgroundColor: "#fff", color: "#000" }
        : { backgroundColor: "#1f1f1f", color: "#fff" };

      const submission = addDoc(collection(db, "messages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString(),
      });

      if (featureSettings.contactNotifications !== false) {
        await toast.promise(
          submission,
          {
            loading: "Sending your message...",
            success: "Thank you. I will get back to you shortly.",
            error: "Failed to send message. Please try again.",
          },
          {
            position: "top-center",
            style: notificationStyle,
            className: "teaser1",
            success: {
              duration: Number(featureSettings.contactNotificationDuration ?? 5000),
              icon: "📩",
            },
          }
        );
      } else {
        await submission;
      }

    setFormData({ name: "", email: "", message: "" });
    localStorage.removeItem(contactDraftKey);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="contactpage">
      <div className="maincontact reveal-on-scroll">
        <div className="contact container d-flex flex-column flex-wrap justify-content-center">
          <h1 className="contactheading">
            Contact Me
          </h1>
          <p>
            Have a software or cybersecurity project in mind? Send me a
            message and I will get back to you.
          </p>
          <div className="contact-logo d-flex flex-row">
            <div className="email">
              <p>
                <a href="mailto:alanjohn9626@gmail.com" aria-label="Email Alan V John">
                  <MdAttachEmail className="email-logo" />
                </a>
              </p>
            </div>
            <div className="git ms-4">
              <p>
                <a href="https://github.com/alanvjohn" target="_blank" rel="noopener noreferrer" aria-label="Alan V John on GitHub">
                  <FaGithub className="github-logo" />
                </a>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Enter your name"
              className="form-control contact-form-control"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength="100"
            />
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`form-control contact-form-control${emailError ? " has-error" : ""}${shakeEmail ? " shake-error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              required
              maxLength="254"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "contact-email-error" : undefined}
            />
            {emailError && (
              <p id="contact-email-error" className="contact-email-error" role="alert">
                {emailError}
              </p>
            )}
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              placeholder="Enter your message"
              name="message"
              className="form-control contact-form-control"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength="5000"
            ></textarea>
            <div className="buttons">
              <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
        </div>
  );
}

export default Contact;
