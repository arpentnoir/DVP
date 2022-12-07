import {
  fireEvent,
} from '@testing-library/react';
import { MuiInputText } from './MuiInputText';
import { samplePropsInputFeilds, jsonFormsTestHarness } from '../../../testUtils';


describe('MaterialInputControl', () => {
  it('should render', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness('', <MuiInputText  handleChange={mockCallback} {...samplePropsInputFeilds} />);
     const title = getByTestId("test-input");
     expect(title).toBeInstanceOf(HTMLElement);
  });

  it('should take input', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness('', <MuiInputText  handleChange={mockCallback} {...samplePropsInputFeilds} />);

    const field = getByTestId('test-input');
    fireEvent.change(field , {target: { value: 'google it'}});
    expect((field as HTMLInputElement).value).toBe('google it');
  });
  it('should clear input on clear button press', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = jsonFormsTestHarness('', <MuiInputText  handleChange={mockCallback} {...samplePropsInputFeilds} />);

    const field = getByTestId('test-input');
    fireEvent.change(field , {target: { value: 'google it'}});
    expect((field as HTMLInputElement).value).toBe('google it');

    const clearButton = getByTestId('clearFieldButton');
    fireEvent.click(clearButton);

    const field2 = getByTestId('test-input');
    expect((field2 as HTMLInputElement).value).toBe('');
  });

});
