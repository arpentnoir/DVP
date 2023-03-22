import { render } from '@dvp/vc-ui';
import { Schemas } from './Schemas';

describe('Schemas', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Schemas />);

    expect(baseElement).toMatchSnapshot();
  });
});
