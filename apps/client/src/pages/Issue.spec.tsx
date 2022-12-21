import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { Issue } from './Issue';
import { RouterWrapper } from '@dvp/vc-ui';
import { Route } from 'react-router-dom';
import {
  schema as partialCooSchema,
  schemaUI as partialCooSchemaUi,
} from './CreateForm/AANZFTACOOPartialSchema';
import {
  schema as fullCooSchema,
  schemaUI as fullCooSchemaUi,
} from './CreateForm/AANZFTACOOSchema';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();

const formName = 'AANZFTA-COO';

const issueButtonText = 'Issue';
const partialFormButtonText = `Upload an exisiting ${formName}`;
const fullFormButtonText = `Create a new ${formName}`;

// TODO: Mock froms when we fetch them from the API
const fullForm = { schema: fullCooSchema, uiSchema: fullCooSchemaUi };
const partialForm = { schema: partialCooSchema, uiSchema: partialCooSchemaUi };

describe('Issue', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should show a dropdown to select a form', () => {
    const { getByTestId } = render(
      <RouterWrapper>
        <Route path="/*" element={<Issue />} />
      </RouterWrapper>
    );

    expect(getByTestId('form-select')).toBeInTheDocument();
  });

  it('should provide two options after clicking issue', async () => {
    const { getByTestId, getByRole, getByText } = render(
      <RouterWrapper>
        <Route path="/*" element={<Issue />} />
      </RouterWrapper>
    );

    expect(getByTestId('form-select')).toBeInTheDocument();
    expect(getByText(issueButtonText)).toBeInTheDocument();

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formName));

    act(() => {
      fireEvent.click(getByText(issueButtonText));
    });

    await waitFor(() => {
      expect(getByText(partialFormButtonText)).toBeInTheDocument();
      expect(getByText(fullFormButtonText)).toBeInTheDocument();
    });
  });

  it('should show full form after clicking full form button', async () => {
    const { getByTestId, getByRole, getByText } = render(
      <RouterWrapper>
        <Route path="/*" element={<Issue />} />
      </RouterWrapper>
    );

    expect(getByTestId('form-select')).toBeInTheDocument();
    expect(getByText(issueButtonText)).toBeInTheDocument();

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formName));

    act(() => {
      fireEvent.click(getByText(issueButtonText));
    });

    await waitFor(() => {
      expect(getByText(partialFormButtonText)).toBeInTheDocument();
      expect(getByText(fullFormButtonText)).toBeInTheDocument();
    });

    fireEvent.click(getByText(fullFormButtonText));

    expect(mockNavigate).toBeCalledWith('/form', { state: { form: fullForm } });
  });

  it('should show partial form after clicking partial form button', async () => {
    const { getByTestId, getByRole, getByText } = render(
      <RouterWrapper>
        <Route path="/*" element={<Issue />} />
      </RouterWrapper>
    );

    expect(getByTestId('form-select')).toBeInTheDocument();
    expect(getByText(issueButtonText)).toBeInTheDocument();

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formName));

    act(() => {
      fireEvent.click(getByText(issueButtonText));
    });

    await waitFor(() => {
      expect(getByText(partialFormButtonText)).toBeInTheDocument();
      expect(getByText(fullFormButtonText)).toBeInTheDocument();
    });

    fireEvent.click(getByText(partialFormButtonText));

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/form', {
        state: { form: partialForm },
      });
    });
  });
});
