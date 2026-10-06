import {Link} from 'react-router';

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="not-found-link">
        Go back to the homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;