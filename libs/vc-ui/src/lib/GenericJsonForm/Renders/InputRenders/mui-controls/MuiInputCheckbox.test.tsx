import { fireEvent } from '@testing-library/react';
import { MuiCheckbox } from './MuiInputCheckbox';
import {
  samplePropsInputFeilds,
  jsonFormsTestHarness,
} from '../../../testUtils';

const mockCallback = jest.fn();

const sampleProps = {
  ...samplePropsInputFeilds,
  schema: { type: 'boolean' },
};

describe('MuiInputCheckbox', () => {
  beforeEach(() => jest.clearAllMocks);

  it('should render', async () => {
    const { findByTestId } = jsonFormsTestHarness(
      '',
      <MuiCheckbox handleChange={mockCallback} {...sampleProps} />
    );
    const title = await findByTestId('testCheckboxInput');
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', () => {
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MuiCheckbox handleChange={mockCallback} {...sampleProps} />
    );

    const field = getByTestId('testCheckboxInput');
    fireEvent.click(field);

    expect(mockCallback).toHaveBeenCalledWith(
      samplePropsInputFeilds.path,
      true
    );
  });
});
