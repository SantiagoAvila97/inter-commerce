import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  SITE_CONFIG,
  formatContactPhone,
  getMailtoUrl,
  getWhatsAppUrl,
} from '@/config/site';

export function HeaderAuthorMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { author, contact } = SITE_CONFIG;

  const phoneDisplay = formatContactPhone(author.phoneCountryCode, author.phone);
  const whatsAppUrl = getWhatsAppUrl(
    author.phoneCountryCode,
    author.phone,
    contact.whatsAppMessage,
  );
  const mailtoUrl = getMailtoUrl(author.email, contact.emailSubject);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  return (
    <div className="header-author-menu" ref={menuRef}>
      <button
        type="button"
        className="app-header__link header-author-menu__trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={toggleMenu}
      >
        {contact.headerMenuLabel}
        <span className="header-author-menu__chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen ? (
        <ul id={menuId} className="header-author-menu__dropdown" role="menu">
          <li role="none">
            <a
              href={whatsAppUrl}
              className="header-author-menu__item"
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              WhatsApp
              <span className="header-author-menu__item-detail">{phoneDisplay}</span>
            </a>
          </li>
          <li role="none">
            <a
              href={mailtoUrl}
              className="header-author-menu__item"
              role="menuitem"
              onClick={closeMenu}
            >
              Email
              <span className="header-author-menu__item-detail">{author.email}</span>
            </a>
          </li>
          <li role="none">
            <a
              href={author.linkedInUrl}
              className="header-author-menu__item"
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              LinkedIn
              <span className="header-author-menu__item-detail">{author.name}</span>
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
