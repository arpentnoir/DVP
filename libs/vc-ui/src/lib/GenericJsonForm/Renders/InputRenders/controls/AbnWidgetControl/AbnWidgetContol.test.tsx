import { fireEvent, waitFor } from '@testing-library/react';
import { AbnWidgetControl } from './AbnWidgetContol';
import {
  samplePropsInputFeilds,
  jsonFormsTestHarness,
} from '../../../../testUtils';

const mockCallback = jest.fn();

const sampleProps = {
  ...samplePropsInputFeilds,
  uischema: { ...samplePropsInputFeilds.uischema, options: { widget: 'ABN' } },
};

describe('AbnWidgetContol', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should render the component', () => {
    const { queryByTestId } = jsonFormsTestHarness(
      '',
      <AbnWidgetControl handleChange={mockCallback} {...sampleProps} />
    );

    expect(queryByTestId('test-input')).toBeTruthy();
  });

  it('should update the value and call the callback function when a user types', async () => {
    const { queryByTestId } = jsonFormsTestHarness(
      '',
      <AbnWidgetControl handleChange={mockCallback} {...sampleProps} />
    );

    const textBox = queryByTestId('test-input') as HTMLInputElement;
    fireEvent.change(textBox, { target: { value: 'test123' } });

    await waitFor(() => {
      expect(textBox.value).toBe('test123');
      expect(mockCallback).toHaveBeenCalledWith(
        samplePropsInputFeilds.path,
        'test123'
      );
    });
  });

  it('should display the default link', () => {
    const { queryByRole } = jsonFormsTestHarness(
      '',
      <AbnWidgetControl handleChange={mockCallback} {...sampleProps} />
    );

    expect(queryByRole('link')?.getAttribute('href')).toBe(
      'https://abr.business.gov.au/'
    );
  });

  it('should display the link passed in', () => {
    const { queryByRole } = jsonFormsTestHarness(
      '',
      <AbnWidgetControl
        handleChange={mockCallback}
        {...sampleProps}
        uischema={{
          ...sampleProps.uischema,
          options: { widget: 'ABN', widgetLink: 'testLink' },
        }}
      />
    );

    expect(queryByRole('link')?.getAttribute('href')).toBe('testLink');
  });
});
