import { render } from '@dvp/vc-ui';
import { Issuers } from './Issuers';

describe('Issuers', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Issuers />);

    expect(baseElement).toMatchSnapshot();
  });
});
