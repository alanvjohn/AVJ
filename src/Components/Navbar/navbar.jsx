import { useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './navbar.css';
import ThemeContext from '../custom/Theme';
import toast, { Toaster } from 'react-hot-toast';

const THEME_TOAST_ID = 'avj-theme-toast';
const THEME_TOASTER_ID = 'theme-notifications';

function NavScrollExample() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const toastContainerStyle = {
    top: '76px',
    left: '16px',
    right: 'auto',
  };

  useEffect(() => {
    if (currentPath !== '/') return undefined;

    toast.dismiss(THEME_TOAST_ID);
    const isDark = theme === 'dark';
    toast((t) => (
      <div className="theme-toast-content">
        <span className="theme-toast-emoji" aria-hidden="true">{isDark ? '🌙' : '🦇'}</span>
        <span>
          <strong>{isDark ? 'Dark mode online' : 'Light mode online'}</strong>
          <small>{isDark ? 'Switch to light' : 'Switch to dark'}</small>
        </span>
        <button type="button" onClick={() => { toast.dismiss(t.id); toggleTheme(); }}>
          {isDark ? 'Go light' : 'Switch'}
        </button>
      </div>
    ), {
      id: THEME_TOAST_ID,
      toasterId: THEME_TOASTER_ID,
      duration: 3000,
      position: 'top-left',
      style: {
        backgroundColor: isDark ? '#fff' : '#1f1f1f',
        color: isDark ? '#000' : '#fff',
        padding: '0.7rem 0.85rem',
        width: 'min(19rem, calc(100vw - 2rem))',
        minWidth: '0',
        maxWidth: 'calc(100vw - 2rem)',
        boxSizing: 'border-box',
      },
      className: 'theme-toast',
    });

    return () => toast.dismiss(THEME_TOAST_ID);
  }, [currentPath, theme, toggleTheme]);

  return (
    <Navbar expand="md" className="bg-auto m-1 border-bottom border-3 navbar ">
      <Container fluid>
        <Navbar.Brand
          as="button"
          type="button"
          className="title"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          AVJ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className='togglebtn'/>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0 "
            style={{ maxHeight: '150px' }}
            navbarScroll
          >
            {currentPath !== '/' && (
              <Nav.Link as={NavLink} to="/" className='links'>Home</Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/about" className='links'>About</Nav.Link>
            <Nav.Link as={NavLink} to="/projects" className='links'>Projects</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className='links'>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Toaster toasterId={THEME_TOASTER_ID} containerStyle={toastContainerStyle} />
    </Navbar>
  );
}

export default NavScrollExample;
