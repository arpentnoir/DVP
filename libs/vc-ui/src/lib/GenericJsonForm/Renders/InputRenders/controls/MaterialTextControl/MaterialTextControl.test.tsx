import {
  fireEvent,
} from '@testing-library/react';
import { MaterialTextControl } from './MatirialTextControl';
import { samplePropsInputFeilds, samplePropsInputFeildsRequired, jsonFormsTestHarness } from '../../../../testUtils';

describe('MaterialTextControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { queryAllByText } = jsonFormsTestHarness('', <MaterialTextControl handleChange={mockCallback} {...samplePropsInputFeilds} />);
     const title = queryAllByText(samplePropsInputFeilds.label)[0];
     expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', () => {
    const mockCallback = jest.fn();
    const { getByLabelText } = jsonFormsTestHarness('', <MaterialTextControl handleChange={mockCallback} {...samplePropsInputFeilds} />);

    const field = getByLabelText('sample');
    fireEvent.change(field , {target: { value: 'google it'}});
    expect((field as HTMLInputElement).value).toBe('google it');
  });

  it('should show when required', async () => {
    const mockCallback = jest.fn();
    const { findByText, getByLabelText } = jsonFormsTestHarness('', <MaterialTextControl handleChange={mockCallback} {...samplePropsInputFeildsRequired} />, true);

    const field = getByLabelText('sample *');
    expect(field).toBeInstanceOf(HTMLElement);

    const required = await findByText('required');
    expect(required).toBeInstanceOf(HTMLElement);


  });
});
