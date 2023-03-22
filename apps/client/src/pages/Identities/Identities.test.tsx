import { render } from '@dvp/vc-ui';
import { Identities } from './Identities';

describe('Identities', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Identities />);

    expect(baseElement).toMatchSnapshot();
  });
});
