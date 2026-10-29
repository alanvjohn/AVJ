import { useEffect, useState } from "react";
import { collection as firestoreCollection, getDocs } from "firebase/firestore";
import {
  ADMIN_EMAIL,
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "../contact/firebase";
import "./me.css";

function Me() {
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
          firestoreCollection(db, "messages")
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
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      setPassword("");
    } catch (signInError) {
      console.error("Admin sign-in failed:", signInError);
      setError("Sign-in failed. Check the password and try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return <div className="adminpage">Checking access...</div>;
  }

  if (!user) {
    return (
      <div className="adminpage">
        <form className="admin-login" onSubmit={handleSignIn}>
          <h1>Private messages</h1>
          <p>Sign in with the administrator account to continue.</p>
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
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSigningIn}>
            {isSigningIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="me" className="adminpage">
      <div className="messages-list">
        <div className="admin-header">
          <h1>Messages</h1>
          <button type="button" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
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

export default Me;
