import { useState, useContext } from "react";
import { MdAttachEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { db, addDoc, collection } from "./firebase"; // Import Firebase config
import "./contact.css";
import toast, { Toaster } from 'react-hot-toast';
import ThemeContext from '../../Components/custom/Theme';


function Contact() {
  const { theme } = useContext(ThemeContext);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
// Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

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
          <div className="contact-logo container d-flex flex-row">
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
              className="form-control m-2"
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
              className="form-control m-2"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength="254"
            />
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              placeholder="Enter your message"
              name="message"
              className="form-control m-2"
                rows="5"
                cols="30"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength="5000"
            ></textarea>
            <div className="buttons container-fluid">
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
