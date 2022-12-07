import { Translator, UISchemaElement } from '@jsonforms/core';
import {
  queryByText,
  render,
} from '@testing-library/react';
import { ErrorObject } from 'ajv';
import { JsonFormsErrorMapper } from './util';


const error: ErrorObject = {
  keyword: 'required',
  instancePath: '#/path',
  schemaPath: '#/path',
  params: {}
}

const translatorObj: Translator = () => "";

const uischema: UISchemaElement & { label?: string } = {
  type: '',
  label: "boppo"
}

describe('genericJsonForm', () => {
  it('should show title', () => {
    const response = JsonFormsErrorMapper(error, translatorObj, uischema);

    expect(response).toEqual("boppo is a required field")
  });
});
