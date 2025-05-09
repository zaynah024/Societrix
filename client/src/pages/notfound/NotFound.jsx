import { Link } from 'react-router-dom';
import '../../styles/pages/notfound/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="back-home">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
