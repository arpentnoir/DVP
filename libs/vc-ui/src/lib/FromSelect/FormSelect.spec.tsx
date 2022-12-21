import { render, fireEvent, within } from '@testing-library/react';
import { FormSelect } from './FormSelect';
import { Route } from 'react-router-dom';
import { RouterWrapper } from '../../utils/RouterWrapper';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();
const handleSubmitMock = jest.fn();

const formMock = {
  schema: {},
  uiSchema: {},
};

const formsMock = [
  { id: '001', name: 'testForm', fullForm: formMock, partialForm: formMock },
];

describe('FormSelect', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render successfully', () => {
    const { baseElement } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should display form option', () => {
    const { getByRole } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formsMock[0].name));

    expect(listbox.getByText(formsMock[0].name)).toBeTruthy();
  });

  it('should update the value of the listbox', () => {
    const { getByRole } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formsMock[0].name));

    expect(getByRole('listbox').querySelector('input')?.value).toBe(
      formsMock[0].id
    );
  });

  it('should display both buttons', () => {
    const { getByText } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Issue')).toBeTruthy();
  });

  it('should disable the issue button if no option is selected', () => {
    const { getByText } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    expect(getByText('Issue').getAttribute('disabled'));
  });

  it('should call the callback function when the user clicks issue', () => {
    const { getByText, getByRole } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    fireEvent.mouseDown(getByRole('listbox').children[0]);
    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText(formsMock[0].name));
    fireEvent.click(getByText('Issue'));

    expect(handleSubmitMock).toBeCalledWith(formsMock[0]);
  });

  it('should go to home when cancel is clicked', () => {
    const { getByText } = render(
      <RouterWrapper>
        <Route
          path="/*"
          element={
            <FormSelect forms={formsMock} onFormSelected={handleSubmitMock} />
          }
        />
      </RouterWrapper>
    );

    fireEvent.click(getByText('Cancel'));

    expect(mockNavigate).toBeCalledWith('/');
  });
});
