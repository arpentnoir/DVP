import { Authenticator } from '@aws-amplify/ui-react';
import { render } from '@dvp/vc-ui';
import { getByAltText, waitFor } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <Authenticator.Provider>
        <NavBar />
      </Authenticator.Provider>
    );
    await waitFor(() => {
      getByAltText(baseElement, 'Australian Border Force Logo');
    });
  });
  it('should hide logout and menu buttons when not authenticated', () => {
    const { queryByTestId } = render(
      <Authenticator.Provider>
        <NavBar />
      </Authenticator.Provider>
    );

    const signOutButton = queryByTestId('button:logout');
    expect(signOutButton).toBeNull();

    const menuButton = queryByTestId('menu-button');
    expect(menuButton).toBeNull();
  });
  it('should show menu and logout buttons when authenticated', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const mockAuth = async () => true;
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(mockAuth);
    const { getByTestId } = render(
      <Authenticator.Provider>
        <NavBar />
      </Authenticator.Provider>
    );
    await waitFor(() => getByTestId('menu-button'));
    getByTestId('button:logout');
  });
});
