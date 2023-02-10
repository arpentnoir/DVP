import { Authenticator } from '@aws-amplify/ui-react';
import { FunctionComponent } from 'react';
import { getEnvConfig } from '../../config';
import { Outlet } from 'react-router-dom';

const envConfig = getEnvConfig();

export const AuthenticatedRoutes: FunctionComponent = () => {
  return (
    <div style={{ height: '100%' }}>
      <Authenticator variation="modal" hideSignUp={envConfig.DISABLE_SIGNUP}>
        <Outlet />
      </Authenticator>
    </div>
  );
};
