import { render } from '@testing-library/react';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import * as pages from '../../pages';
import { Home } from '../../pages';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';

describe('BaseApp', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<AuthenticatedRoutes />);

    expect(baseElement).toMatchSnapshot();
  });
  it('should not show authenticated routes', () => {
    (jest.spyOn(pages, 'Home') as jest.SpyInstance).mockImplementation(() => {
      const navigate = useNavigate();
      useEffect(() => {
        navigate('/authed');
      }, []);
    });

    const { queryByText } = render(
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthenticatedRoutes />}>
            <Route path="/authed" element={<div>authed route</div>} />
          </Route>
        </Routes>
      </Router>
    );
    const authedElement = queryByText('authed route');
    expect(authedElement).toBeNull();
  });
});
