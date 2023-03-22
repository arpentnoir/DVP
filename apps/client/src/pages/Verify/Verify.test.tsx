import { render } from '@dvp/vc-ui';
import { Verify } from './Verify';

describe('Verify', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Verify />);

    expect(baseElement).toMatchSnapshot();
  });
});
