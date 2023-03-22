import { render } from '@dvp/vc-ui';
import { Issue } from './Issue';

describe('Issue', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Issue />);

    expect(baseElement).toMatchSnapshot();
  });
});
