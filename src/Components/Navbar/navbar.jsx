import { useContext, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './navbar.css';
import ThemeContext from '../custom/Theme';
import toast, { Toaster } from 'react-hot-toast';

function NavScrollExample() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const onPageLoad = (currentTheme) => {
    toast.dismiss();
    if (currentTheme === 'light') {
      toast('Ahh, my eyes! I need a dark theme.🦇', {
        duration: 3000,
        position: 'top-left',
        style: {
          backgroundColor: '#1f1f1f',
          color: '#fff',
        },
        className: 'teaser',
        icon: '👈',
      });
    } else if (currentTheme === 'dark') {
      toast('My eyes are on vacation—bring on the light theme!', {
        duration: 3000,
        position: 'top-left',
        style: {
          backgroundColor: '#fff',
          color: '#000',
          minWidth:'30%',
        },
        className: 'teaser',
        icon: '👈',
      });
    }
  };
useEffect(() => {
  if (currentPath === '/') {  
    onPageLoad(theme);
  }
}, [theme, currentPath]);

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
            <Nav.Link as={NavLink} to="/about#security-focus" className='links'>Security</Nav.Link>
            <Nav.Link as={NavLink} to="/projects" className='links'>Projects</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className='links'>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Toaster />
    </Navbar>    
  );
}

export default NavScrollExample;
