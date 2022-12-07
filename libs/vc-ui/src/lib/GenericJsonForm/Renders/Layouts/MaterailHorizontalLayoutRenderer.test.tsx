import {  jsonFormsTestHarness, } from "../../testUtils";
import { MaterialHorizontalLayoutRenderer } from "./MaterialHorizontalLayout";
import { ControlElement, HorizontalLayout } from "@jsonforms/core";

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  };
});
window = Object.assign(window, { innerWidth: 900 });

window.dispatchEvent(new Event('resize'));

const jsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    personalData: {
      type: 'object',
      properties: {
        middleName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        }
      },
      required: ['middleName', 'lastName']
    }
  },
  required: ['name']
};

const firstControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};
const secondControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/middleName'
};
const thirdControlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/personalData/properties/lastName'
};

const layout: HorizontalLayout = {
  type: 'HorizontalLayout',
  elements: [firstControlElement, secondControlElement, thirdControlElement]
};

describe('MaterialHorizontalLayoutRenderer', () => {
  it('should render sub components', async () => {
    const { findAllByTestId } = jsonFormsTestHarness('',  <MaterialHorizontalLayoutRenderer
    schema={jsonSchema}
    uischema={layout}
    direction="row"
    enabled
    visible
    path=""
  />);
    const input = await findAllByTestId("test-input");
    expect(input[0]).toBeInstanceOf(HTMLElement);
    expect(input.length).toEqual(3);
  });
});
