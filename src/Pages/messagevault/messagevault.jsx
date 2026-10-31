import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_EMAIL,
  auth,
  addDoc,
  collection,
  db,
  getDocs,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "../contact/firebase";
import "./messagevault.css";

function MessageVault() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        if (currentUser) signOut(auth);
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "messages")
        );
        const messagesArray = querySnapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...messageDoc.data(),
        }));

        messagesArray.sort(
          (first, second) =>
            new Date(second.timestamp) - new Date(first.timestamp)
        );
        setMessages(messagesArray);
        setError("");
      } catch (fetchError) {
        console.error("Error fetching messages:", fetchError);
        setError("Unable to load messages.");
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsSigningIn(true);
    setError("");

    try {
      const credential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      try {
        await addDoc(collection(db, "adminLoginLogs"), {
          email: credential.user.email,
          uid: credential.user.uid,
          timestamp: new Date().toISOString(),
        });
      } catch (logError) {
        console.error("Admin login succeeded but could not be logged:", logError);
      }
      setPassword("");
    } catch (signInError) {
      console.error("Admin sign-in failed:", signInError);
      setError("Sign-in failed. Check the password and try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return <div className="vault-page">Checking access...</div>;
  }

  if (!user) {
    return (
      <div className="vault-page">
        <form className="vault-login" onSubmit={handleSignIn}>
          <h1>Vault</h1>
          <p>Sign in to continue.</p>
          <input
            type="email"
            value={ADMIN_EMAIL}
            readOnly
            aria-label="Administrator email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="vault-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="vault" className="vault-page">
      <div className="vault-list">
        <div className="vault-header">
          <h1>Vault</h1>
          <div className="vault-header-actions">
            <Link to="/vault/admin">Admin controls</Link>
            <button type="button" onClick={() => signOut(auth)}>
              Sign out
            </button>
          </div>
        </div>
        {error && <p className="vault-error" role="alert">{error}</p>}
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>{message.name}</strong>
                <p>{message.message}</p>
                <small>Email: {message.email}</small>
                <small>Date: {new Date(message.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MessageVault;
