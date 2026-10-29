import { createContext, useState, useEffect, useRef } from 'react';
import Loader from '../loader/loader'; // Ensure the path to Loader is correct

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimerRef = useRef(null);

  const applyTheme = (newTheme) => {
    const safeTheme = newTheme === 'dark' ? 'dark' : 'light';
    setIsLoading(true); // Show loader
    setTheme(safeTheme);
    document.body.classList.toggle('dark-theme', safeTheme === 'dark');
    localStorage.setItem('theme', safeTheme);

    // Simulate a delay to show the loader
    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = window.setTimeout(() => {
      setIsLoading(false); // Hide loader
    }, 500); // Adjust delay as needed
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      const initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
      applyTheme(initialTheme);

      // Listen for system theme changes
      const handleThemeChange = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      prefersDarkScheme.addEventListener('change', handleThemeChange);

      // Cleanup listener on component unmount
      return () => {
        prefersDarkScheme.removeEventListener('change', handleThemeChange);
      };
    }
    return () => {
      window.clearTimeout(loadingTimerRef.current);
    };
  }, []); // Empty dependency array

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {isLoading && <Loader />} {/* Show loader if loading */}
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
