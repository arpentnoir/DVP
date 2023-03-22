import { render } from '@dvp/vc-ui';
import { IssuerSchemas } from './IssuerSchemas';

describe('IssuerSchemas', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<IssuerSchemas />);

    expect(baseElement).toMatchSnapshot();
  });
});
