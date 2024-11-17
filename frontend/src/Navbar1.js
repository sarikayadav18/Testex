// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ authenticated }) => {
//   return (
//     <nav>
//       <ul>
//         {authenticated ? (
//           <>
//             <li><Link to="/TeacherHome">Teacher Home</Link></li>
//             <li><Link to="/StudentHome">Student Home</Link></li>
//             <li><Link to="/CreateMockTest">Create Mock Test</Link></li>
//             <li><Link to="/questions">Questions</Link></li>
//           </>
//         ) : (
//           <>
//             <li><Link to="/signup">Signup</Link></li>
//             <li><Link to="/login">Login</Link></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;