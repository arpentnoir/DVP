import { fireEvent } from '@testing-library/react';
import { MaterialBooleanControl } from './MaterialBooleanControl';
import {
  samplePropsInputFeilds,
  jsonFormsTestHarness,
} from '../../../../testUtils';

const mockCallback = jest.fn();

const sampleProps = {
  ...samplePropsInputFeilds,
  schema: { ...samplePropsInputFeilds.schema, type: 'boolean' },
};

describe('MaterialBooleanControl', () => {
  beforeEach(() => jest.clearAllMocks);

  it('should render', () => {
    const { queryAllByText } = jsonFormsTestHarness(
      '',
      <MaterialBooleanControl handleChange={mockCallback} {...sampleProps} />
    );
    const title = queryAllByText(samplePropsInputFeilds.label)[0];
    expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', () => {
    const { getByTestId } = jsonFormsTestHarness(
      '',
      <MaterialBooleanControl handleChange={mockCallback} {...sampleProps} />
    );

    const field = getByTestId('testCheckboxInput');
    fireEvent.click(field);

    expect(mockCallback).toHaveBeenCalledWith(
      samplePropsInputFeilds.path,
      true
    );
  });
});
