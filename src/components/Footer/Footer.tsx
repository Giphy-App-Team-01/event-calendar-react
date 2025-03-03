import React from 'react';
import './Footer.css';
import Container from '../Container/Container';

const Footer: React.FC = () => {
  return (
    <Container className='bg-gray-800 py-6 text-center text-m text-white'>
      <footer>
        <p>
          &copy; {new Date().getFullYear()} Event Calendar React App. All rights
          reserved.
        </p>
      </footer>
    </Container>
  );
};

export default Footer;
