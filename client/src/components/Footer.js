import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-primary text-center">
      <Container>
        <div className="text-white py-3">
          &copy; {currentYear} Audouin Thomas
        </div>
      </Container>
    </footer>
  );
};

export default Footer;