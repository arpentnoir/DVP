import { render } from '@dvp/vc-ui';
import { Viewer } from './Viewer';

describe('Viewer', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Viewer />);

    expect(baseElement).toMatchSnapshot();
  });
});
