import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Pages
import Pageloader from "./Pages/pageloader";
const Aboutldr = lazy(() => import("./Pages/abtloader/aboutldr"));
const Projects = lazy(() => import("./Pages/project/projects"));
const Contact = lazy(() => import("./Pages/contact/contact"));
const MessageVault = lazy(() => import("./Pages/messagevault/messagevault"));
const VaultAdmin = lazy(() => import("./Pages/messagevault/vaultadmin"));
import "./App.css";

// Components
import Navbar from "./Components/Navbar/navbar";
import Loader from "./Components/loader/loader";
import Cursor from "./Components/Cursor/cursor";
import ScrollExperience from "./Components/ScrollExperience/scroll-experience";
import { ThemeProvider } from "./Components/custom/Theme";
import FeatureSettingsContext from "./config/FeatureSettingsContext";
import {
  getFeatureSettings,
  loadFeatureSettings,
  subscribeFeatureSettings,
} from "./config/featureSettings";

// Framer Motion transitions
const pageVariants = {
  initial: { opacity: 0.2 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 1,
};

function App() {
  const location = useLocation();
  const [featureSettings, setFeatureSettings] = useState(getFeatureSettings);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    let isMounted = true;
    let hasReceivedInitialSnapshot = false;
    let lastRefreshValue = null;

    const unsubscribe = subscribeFeatureSettings((settings) => {
      setFeatureSettings(settings);
    }, (refreshAt) => {
      const refreshValue = refreshAt?.toMillis
        ? refreshAt.toMillis()
        : String(refreshAt);
      if (hasReceivedInitialSnapshot && lastRefreshValue !== refreshValue) {
        window.location.reload();
      }
      lastRefreshValue = refreshValue;
      hasReceivedInitialSnapshot = true;
    });

    loadFeatureSettings().then((settings) => {
      if (isMounted) setFeatureSettings(settings);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider>
      <FeatureSettingsContext.Provider value={featureSettings}>
        <ScrollExperience />
        <Cursor />
        <Navbar />
        <div>
          <Suspense fallback={<Loader />}>
            <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Pageloader />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Aboutldr />
                </motion.div>
              }
            />
            <Route
              path="/projects"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Projects />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Contact />
                </motion.div>
              }
            />
            <Route
              path="/vault"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MessageVault />
                </motion.div>
              }
            />
            <Route
              path="/vault/admin"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <VaultAdmin />
                </motion.div>
              }
            />
            <Route
              path="*"
              element={
                <main className="not-found">
                  <h1>Page not found</h1>
                  <p>The page you requested does not exist.</p>
                  <Link to="/">Return home</Link>
                </main>
              }
            />
            </Routes>
          </Suspense>
        </div>
      </FeatureSettingsContext.Provider>
    </ThemeProvider>
  );
}

export default App;
