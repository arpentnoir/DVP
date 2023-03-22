import { render } from '@dvp/vc-ui';
import { Home } from './Home';

describe('Home', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Home />);

    expect(baseElement).toMatchSnapshot();
  });
});
