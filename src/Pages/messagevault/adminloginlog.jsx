import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_EMAIL,
  auth,
  collection,
  db,
  getDocs,
  limit,
  onAuthStateChanged,
  orderBy,
  query,
  signOut,
} from "../contact/firebase";
import "./vaultadmin.css";

function AdminLoginLog() {
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [loginLogs, setLoginLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        if (currentUser) signOut(auth);
        setUser(null);
      }
      setIsCheckingAccess(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const loadLoginLogs = async () => {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "adminLoginLogs"),
            orderBy("timestamp", "desc"),
            limit(50)
          )
        );
        setLoginLogs(snapshot.docs.map((loginDoc) => loginDoc.data()));
        setError("");
      } catch (loadError) {
        console.error("Admin login log check failed:", loadError);
        setError("Unable to load administrator login history.");
      }
    };

    loadLoginLogs();
    return undefined;
  }, [user]);

  if (isCheckingAccess) {
    return <main className="vault-admin-page">Checking access...</main>;
  }

  if (!user) {
    return (
      <main className="vault-admin-page">
        <div className="vault-admin-locked">
          <p className="vault-admin-eyebrow">Private area</p>
          <h1>Login history is protected.</h1>
          <p>Sign in through the Vault before opening this page.</p>
          <Link to="/vault" className="vault-admin-button">Go to Vault</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="vault-admin-page">
      <div className="vault-admin-shell">
        <header className="vault-admin-header">
          <div>
            <p className="vault-admin-eyebrow">Security activity</p>
            <h1>Admin login history</h1>
            <p>Recent successful administrator sign-ins recorded in Firestore.</p>
          </div>
          <div className="vault-admin-actions">
            <Link to="/vault/admin" className="vault-admin-button">Admin controls</Link>
            <Link to="/vault" className="vault-admin-button">Back to Vault</Link>
            <button type="button" onClick={() => signOut(auth)}>Sign out</button>
          </div>
        </header>

        <section className="vault-admin-settings admin-login-log-page" aria-labelledby="login-log-title">
          <div>
            <p className="vault-admin-eyebrow">Successful sign-ins</p>
            <h2 id="login-log-title">Login log</h2>
            <p>Email and timestamp only. Passwords are never stored.</p>
          </div>
          {error && <p className="vault-admin-error" role="alert">{error}</p>}
          {loginLogs.length > 0 ? (
            <ul className="vault-admin-login-log">
              {loginLogs.map((login, index) => (
                <li key={`${login.timestamp}-${index}`}>
                  <strong>{login.email}</strong>
                  <span>{new Date(login.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p className="admin-setting-hint">No successful sign-ins recorded yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminLoginLog;
