import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Pages
import Pageloader from "./Pages/pageloader";
const Aboutldr = lazy(() => import("./Pages/abtloader/aboutldr"));
const Projects = lazy(() => import("./Pages/project/projects"));
const Contact = lazy(() => import("./Pages/contact/contact"));
const MessageVault = lazy(() => import("./Pages/messagevault/messagevault"));
import "./App.css";

// Components
import Navbar from "./Components/Navbar/navbar";
import Loader from "./Components/loader/loader";
import { ThemeProvider } from "./Components/custom/Theme";

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
