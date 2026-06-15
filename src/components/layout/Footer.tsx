import { Link } from 'react-router-dom';
import {
  SITE_CONFIG,
  formatContactPhone,
  getMailtoUrl,
  getWhatsAppUrl,
} from '@/config/site';

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6h15l-1.5 9h-12L6 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="19" r="1.5" fill="currentColor" />
      <circle cx="18" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BrandLogo({ variant }: { variant: 'header' | 'footer' }) {
  if (variant === 'header') {
    return (
      <span className="brand-logo-wrap brand-logo-wrap--header">
        <img
          src="/logo.png"
          alt="Inter Rapidísimo"
          className="brand-logo brand-logo--icon"
          draggable={false}
        />
        <img
          src="/inter-rapidisimo.png"
          alt="Inter Rapidísimo"
          className="brand-logo brand-logo--wordmark"
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span className={`brand-logo-wrap brand-logo-wrap--${variant}`}>
      <img
        src="/inter-rapidisimo.png"
        alt="Inter Rapidísimo"
        className="brand-logo"
        draggable={false}
      />
    </span>
  );
}

export function HeaderLogo() {
  return (
    <Link to="/" className="app-header__brand" aria-label="Inter Rapidísimo — Inicio">
      <BrandLogo variant="header" />
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { author, contact } = SITE_CONFIG;
  const phoneDisplay = formatContactPhone(author.phoneCountryCode, author.phone);
  const whatsAppUrl = getWhatsAppUrl(
    author.phoneCountryCode,
    author.phone,
    contact.whatsAppMessage,
  );
  const mailtoUrl = getMailtoUrl(author.email, contact.emailSubject);

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div>
          <BrandLogo variant="footer" />
          <p className="app-footer__tagline">
            Te la ponemos refácil. Compra en línea con entrega confiable.
          </p>
          <p className="app-footer__legal">
            Proyecto demostrativo InterCommerce. Precios e impuestos calculados en el resumen del
            carrito.
          </p>
        </div>

        <div>
          <h3 className="app-footer__heading">Explorar</h3>
          <nav className="app-footer__links" aria-label="Enlaces del sitio">
            <Link to="/" className="app-footer__link">
              Catálogo
            </Link>
            <Link to="/cart" className="app-footer__link">
              Carrito
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="app-footer__heading">Contacto</h3>
          <p className="app-footer__contact-note">{contact.footerNote}</p>
          <ul className="app-footer__contact-list">
            <li>
              <a href={mailtoUrl} className="app-footer__link">
                {author.email}
              </a>
            </li>
            <li>
              <a
                href={whatsAppUrl}
                className="app-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={author.linkedInUrl}
                className="app-footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn · {author.name}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="app-footer__bottom">
        © {year} Inter Rapidísimo · InterCommerce · Desarrollado por {author.name}
      </p>
    </footer>
  );
}

export { CartIcon };
