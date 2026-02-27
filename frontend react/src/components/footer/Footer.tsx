import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="container-fluid">
        <div className="footer-content">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5>Mana Market</h5>
              <p className="text-light">Tu tienda especializada en Magic: The Gathering</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h5>Contacto</h5>
              <p className="text-light">
                Email: info@manamarket.com<br/>
                Teléfono: +34 123 456 789
              </p>
            </div>
            <div className="col-md-4">
              <h5>Síguenos</h5>
              <div className="social-links">
                <a href="#" className="text-light">Facebook</a>
                <a href="#" className="text-light ms-3">Twitter</a>
                <a href="#" className="text-light ms-3">Instagram</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="mb-0">&copy; 2024 Mana Market. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
