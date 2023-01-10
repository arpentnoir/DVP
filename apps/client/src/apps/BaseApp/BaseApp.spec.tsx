import { getByText, render } from '@testing-library/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pages from '../../pages';
import { BaseAppWithoutAuth as BaseApp } from './BaseApp';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('../../pages', () => ({
  ...jest.requireActual('../../pages'),
}));

describe('BaseApp', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<BaseApp />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should display app error component if app throws uncaught error', () => {
    (jest.spyOn(pages, 'Home') as jest.SpyInstance).mockImplementation(() => {
      throw Error('Soopa Doopa');
    });

    const { baseElement } = render(<BaseApp />);

    getByText(baseElement, 'Something went wrong');
  });

  it('should display not found error component if route is not defined', () => {
    (jest.spyOn(pages, 'Home') as jest.SpyInstance).mockImplementation(() => {
      const navigate = useNavigate();
      useEffect(() => {
        navigate('nonExistentPage');
      }, []);
    });

    const { baseElement } = render(<BaseApp />);

    getByText(baseElement, 'PAGE NOT FOUND');
  });
});
