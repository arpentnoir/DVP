import { render, fireEvent } from '@testing-library/react';
import { ChooseForm } from './ChooseForm';

const onSelectedMock = jest.fn();

const fullFormMock = {
  schema: { test: 'fullSchema' },
  uiSchema: { test: 'fullUiSchema' },
};

const partialFormMock = {
  schema: { test: 'partialSchema' },
  uiSchema: { test: 'partialUiSchema' },
};

const formMock = {
  id: '001',
  name: 'testForm',
  fullForm: fullFormMock,
  partialForm: partialFormMock,
};

describe('ChooseForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render successfully', () => {
    const { baseElement } = render(
      <ChooseForm form={formMock} onSelected={onSelectedMock} />
    );

    expect(baseElement).toBeTruthy();
  });

  it('should show two buttons', () => {
    const { getByText } = render(
      <ChooseForm form={formMock} onSelected={onSelectedMock} />
    );

    expect(getByText(`Upload an exisiting ${formMock.name}`)).toBeTruthy();
    expect(getByText(`Create a new ${formMock.name}`)).toBeTruthy();
  });

  it('should pass the correct form to the callback function when the corresponding button is pressed', () => {
    const { getByText } = render(
      <ChooseForm form={formMock} onSelected={onSelectedMock} />
    );

    fireEvent.click(getByText(`Upload an exisiting ${formMock.name}`));
    expect(onSelectedMock).lastCalledWith(formMock.partialForm);

    fireEvent.click(getByText(`Create a new ${formMock.name}`));
    expect(onSelectedMock).lastCalledWith(formMock.fullForm);
  });
});
