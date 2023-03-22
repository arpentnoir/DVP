import { render } from '@dvp/vc-ui';
import { schema, schemaUI } from './AANZFTACOOSchema';
import { CreateFormPage } from './CreateFormPage';

const mockLocation = {
  state: { form: { schema, uiSchema: schemaUI } },
};

describe('CreateFormPage', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<CreateFormPage title="Test" />, {
      location: mockLocation,
    });

    expect(baseElement).toMatchSnapshot();
  });
});
