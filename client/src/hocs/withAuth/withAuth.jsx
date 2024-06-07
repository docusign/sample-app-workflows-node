import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTE } from '../../constants.js';

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
      return <Navigate to={ROUTE.ROOT} />
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
