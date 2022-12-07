import {
  render,
} from '@testing-library/react';
import { GenericJsonForm } from './GenericJsonForm';
import { jsonFormsTestHarness } from './testUtils';

const testSchema = {
  type: 'object',
  properties: {
    testInput: {
      type: 'string',
      title: 'test input',
    },
  }
}

describe('genericJsonForm', () => {
  it('should show title', () => {
    const { queryByText } = render(
      <GenericJsonForm
         schema={testSchema}
         onSubmit={() => jest.fn()}
         title={'Test Example'}
         submitting={false}
        />);
     const title = queryByText("Test Example");
     expect(title).toBeInstanceOf(HTMLElement);
  });
  it('should show error message', () => {
    const { queryByText } = render(
      <GenericJsonForm
         schema={testSchema}
         onSubmit={() => jest.fn() }
         title={'Test Example'}
         submitting={false}
         submissionError={"failed to submit"}
        />);
     const input = queryByText("failed to submit");
     expect(input).toBeInstanceOf(HTMLElement);
  });

  it('should all fields in form', () => {
    const { getAllByTestId } =   jsonFormsTestHarness('' ,
      <GenericJsonForm
         schema={testSchema}
         onSubmit={() => jest.fn() }
         title={'Test Example'}
         submitting={false}
         submissionError={"failed to submit"}
        />);
     const input = getAllByTestId("test-input");
     expect(input[0]).toBeInstanceOf(HTMLInputElement);
     expect(input.length).toEqual(1);
  });
});
