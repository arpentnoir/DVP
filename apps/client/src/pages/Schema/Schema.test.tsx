import { render } from '@dvp/vc-ui';
import { Schema } from './Schema';

describe('Schema', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Schema />);

    expect(baseElement).toMatchSnapshot();
  });
});
