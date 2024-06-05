import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
      return <Navigate to={"/"} />
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
