import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoginStatus, ROUTE } from '../../constants.js';
import { useEffect } from 'react';
import { api } from '../../api';

const withAuth = WrappedComponent => {
  const AuthHOC = props => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authType = useSelector(state => state.auth.authType);

    useEffect(() => {
      const checkLoginStatus = async () => {
        if (authType === LoginStatus.ACG) {
          const response = await api.acg.loginStatus();
          !response && dispatch({ type: 'LOGOUT' });
        }
        if (authType === LoginStatus.JWT) {
          const response = await api.jwt.loginStatus();
          !response && dispatch({ type: 'LOGOUT' });
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
