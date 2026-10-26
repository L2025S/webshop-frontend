
import { Link } from "react-router";
import "../styles/CookieInfoPage.css";

export default function CookieInfoPage() {
  return (
    <section className="cookie-info-page">
      <Link to="/" className="cookie-back-link">
        ← Back to shop
      </Link>

      <header className="cookie-info-header">
        <div className="cookie-info-icon" aria-hidden="true">
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

        <span className="cookie-info-eyebrow">
          SECURITY & PRIVACY
        </span>

        <h1>How we protect your session</h1>

        <p>
          Your account uses an HttpOnly cookie to help protect
          your authentication token while you use the webshop.
          Here is what that means and why it matters.
        </p>
      </header>

      <div className="cookie-info-sections">
        <article className="cookie-info-card">
          <span className="cookie-section-number">01</span>
          <h2>What is an HttpOnly cookie?</h2>
          <p>
            A cookie is a small piece of data that your browser
            stores. Our authentication cookie contains a token
            used to identify your authenticated session.
          </p>
          <p>
            The <code>HttpOnly</code> attribute prevents
            JavaScript running in the browser from reading
            that cookie through APIs such as
            <code> document.cookie</code>.
          </p>
        </article>

        <article className="cookie-info-card">
          <span className="cookie-section-number">02</span>
          <h2>Why is this more secure?</h2>
          <p>
            If a website has a cross-site scripting (XSS)
            vulnerability, malicious JavaScript may be able to
            read tokens stored in localStorage. An HttpOnly
            cookie cannot be read that way.
          </p>
          <p>
            This reduces the risk of an authentication token
            being stolen through JavaScript. It does not prevent
            every type of attack, so other security measures
            are still important.
          </p>
        </article>

        <article className="cookie-info-card">
          <span className="cookie-section-number">03</span>
          <h2>How does it work?</h2>

          <ol className="cookie-steps">
            <li>
              <span className="cookie-step-dot">1</span>
              <div>
                <strong>You log in</strong>
                <p>
                  The authentication server verifies your
                  credentials and issues a token.
                </p>
              </div>
            </li>

            <li>
              <span className="cookie-step-dot">2</span>
              <div>
                <strong>Your browser stores the cookie</strong>
                <p>
                  The server sends it using the Set-Cookie
                  response header with the HttpOnly attribute.
                </p>
              </div>
            </li>

            <li>
              <span className="cookie-step-dot">3</span>
              <div>
                <strong>Your session is authenticated</strong>
                <p>
                  Your browser sends the cookie automatically
                  with eligible requests to the server.
                </p>
              </div>
            </li>

            <li>
              <span className="cookie-step-dot">4</span>
              <div>
                <strong>You log out</strong>
                <p>
                  The server expires the authentication cookie
                  so your browser stops sending it.
                </p>
              </div>
            </li>
          </ol>
        </article>

        <article className="cookie-info-card">
          <span className="cookie-section-number">04</span>
          <h2>What about other protections?</h2>
          <p>
            HttpOnly is one layer of security, not a complete
            security solution. Authentication cookies should
            also be configured appropriately for your
            application.
          </p>

          <ul className="cookie-security-list">
            <li>
              <strong>Secure:</strong> Sends the cookie only
              over HTTPS when enabled.
            </li>
            <li>
              <strong>SameSite:</strong> Helps restrict when
              browsers send cookies with cross-site requests.
            </li>
            <li>
              <strong>CSRF protection:</strong> Additional
              safeguards may be needed because browsers
              automatically attach cookies to requests.
            </li>
            <li>
              <strong>Expiration:</strong> Limits how long
              the cookie remains valid.
            </li>
          </ul>
        </article>
      </div>

      <footer className="cookie-info-footer">
        <p>
          We use security measures to help protect your
          account and authentication session.
        </p>
        <Link to="/" className="cookie-back-to-shop">
          Return to webshop →
        </Link>
      </footer>
    </section>
  );
}
