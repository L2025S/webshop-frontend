
import { Link } from "react-router";
import "../styles/CookieInfoPage.css";

export default function CookieInfoPage() {
  return (
    <section className="cookie-info-page">
      <Link to="/" className="cookie-back-link">
        ← Back to shop
      </Link>

      <header className="cookie-info-header">
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
