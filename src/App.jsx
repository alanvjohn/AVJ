import { useRef, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";

// Pages
import Pageloader from "./Pages/pageloader";
import Aboutldr from "./Pages/abtloader/aboutldr";
import Projects from "./Pages/project/projects";
import Contact from "./Pages/contact/contact";
import MessageVault from "./Pages/messagevault/messagevault";
import "./App.css";

// Components
import Navbar from "./Components/Navbar/navbar";
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
  const ref = useRef(null);
  const location = useLocation();

  const options = {
    smooth: true,
    reloadOnContextChange:true,
    lerp: 0.05,
    repeat:true,
    tablet: {
      smooth: true,
      reloadOnContextChange:true,
    },
    smartphone: {
      lerp: 0.05,
      smooth: true,
      reloadOnContextChange: true,
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <ThemeProvider>
      <LocomotiveScrollProvider
        options={options}
        containerRef={ref}
        watch={location.pathname}
      >
        <Navbar />
        <div data-scroll-container ref={ref}>
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
        </div>
      </LocomotiveScrollProvider>
    </ThemeProvider>
  );
}

export default App;
