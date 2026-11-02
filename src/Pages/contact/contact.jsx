import { useState, useContext } from "react";
import { MdAttachEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { db, addDoc, collection } from "./firebase"; // Import Firebase config
import "./contact.css";
import toast, { Toaster } from 'react-hot-toast';
import ThemeContext from '../../Components/custom/Theme';

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

  const closestCommonDomain = commonEmailDomains
    .map((knownDomain) => ({
      domain: knownDomain,
      distance: levenshteinDistance(domain, knownDomain),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (closestCommonDomain && closestCommonDomain.distance <= 2 && domain !== closestCommonDomain.domain) {
    return `That domain looks incorrect. Did you mean ${closestCommonDomain.domain}?`;
  }

  return "";
};

const levenshteinDistance = (first, second) => {
  const distances = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let row = 1; row <= first.length; row += 1) {
    let previousDiagonal = distances[0];
    distances[0] = row;
    for (let column = 1; column <= second.length; column += 1) {
      const current = distances[column];
      distances[column] = first[row - 1] === second[column - 1]
        ? previousDiagonal
        : Math.min(previousDiagonal, distances[column - 1], current) + 1;
      previousDiagonal = current;
    }
  }
  return distances[second.length];
};

function Contact() {
  const { theme } = useContext(ThemeContext);

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

      await toast.promise(
        addDoc(collection(db, "messages"), {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          timestamp: new Date().toISOString(),
        }),
        {
          loading: "Sending your message...",
          success: "Thank you. I will get back to you shortly.",
          error: "Failed to send message. Please try again.",
        },
        {
          position: "top-center",
          style: notificationStyle,
          className: "teaser1",
          success: { duration: 5000, icon: "📩" },
        }
      );

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
