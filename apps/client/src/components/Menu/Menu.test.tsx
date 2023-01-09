import { render } from '@dvp/vc-ui';
import { fireEvent, waitFor } from '@testing-library/react';
import { MenuBar } from './Menu';

const mockNavigate = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const menuItemNames = {
  Home: '/',
  Help: '/',
  Verify: '/verify',
  Documents: '/documents',
};

describe('Menu', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<MenuBar />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should show list of links when open', async () => {
    const { getByTestId, queryByTestId } = render(<MenuBar />);

    Object.keys(menuItemNames).forEach((menuItem) => {
      expect(queryByTestId(`menu-item:${menuItem}`)).toBeFalsy();
    });

    fireEvent.click(getByTestId('menu-button'));

    await waitFor(() =>
      Object.keys(menuItemNames).forEach((menuItem) => {
        expect(queryByTestId(`menu-item:${menuItem}`)).toBeTruthy();
      })
    );
  });

  it('should navigate to correct route for each link', () => {
    const { getByTestId } = render(<MenuBar />);

    fireEvent.click(getByTestId('menu-button'));

    Object.entries(menuItemNames).forEach(([name, path]) => {
      fireEvent.click(getByTestId(`menu-item:${name}`));

      expect(mockNavigate).toHaveBeenCalledWith(path);
    });
  });
});
