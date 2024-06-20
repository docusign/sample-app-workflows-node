import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LoginStatus, ROUTE } from '../../constants.js';
import { api } from '../../api';

const withAuth = WrappedComponent => {
  const AuthHOC = props => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authType = useSelector(state => state.auth.authType);

    useEffect(() => {
      const checkLoginStatus = async () => {
        if (authType === LoginStatus.ACG) {
          const isLoggedIn = await api.acg.loginStatus();
          !isLoggedIn && dispatch({ type: 'CLEAR_STATE' }) && localStorage.clear();
        }
        if (authType === LoginStatus.JWT) {
          const isLoggedIn = await api.jwt.loginStatus();
          !isLoggedIn && dispatch({ type: 'CLEAR_STATE' }) && localStorage.clear();
        }
      };

      checkLoginStatus();
    }, [authType, dispatch]);

    if (!isAuthenticated) {
      return <Navigate to={ROUTE.ROOT} />;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
