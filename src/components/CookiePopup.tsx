
import { Link } from "react-router";
import "../styles/Popup.css";
import type { PopupProps } from "../types/Popup";

export default function Popup({
  isOpen,
  onClose,
  children,
}: PopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onClick={onClose}
    >
      <div
        className="popup-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="popup-close-btn"
          onClick={onClose}
          aria-label="Close popup"
        >
          &times;
        </button>

        <div className="popup-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <span className="popup-eyebrow">
          SECURITY & PRIVACY
        </span>

        <h2 id="popup-title">Your session is protected</h2>

        <div className="popup-body">{children}</div>

        <div className="popup-actions">
          <Link
            to="/cookie-info"
            className="popup-info-link"
            onClick={onClose}
          >
            Learn more about cookies
            <span aria-hidden="true">→</span>
          </Link>

          <button
            className="popup-dismiss-btn"
            onClick={onClose}
          >
            Got it
          </button>
        </div>

        <p className="popup-footer">
          Your security matters to us.
        </p>
      </div>
    </div>
  );
}
