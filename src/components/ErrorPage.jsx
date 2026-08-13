import { Link } from "react-router";
const ErrorPage = () => {
  return (
    <div id="error-title">
      <h3>Error 404!</h3>
      <Link to="/">
        <button className="btn-secondary-action">Go Back Home</button>
      </Link>
    </div>
  );
};

export default ErrorPage;
