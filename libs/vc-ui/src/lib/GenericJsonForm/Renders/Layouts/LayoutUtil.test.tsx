import {  jsonFormsTestHarness, } from "../../testUtils";
import { ControlElement, GroupLayout } from "@jsonforms/core";
import { MaterialLayoutRenderer } from "./LayoutUtil";

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

const layout: GroupLayout = {
  type: 'Group',
  elements: [firstControlElement, secondControlElement, thirdControlElement]
};

describe('MaterialLayoutRenderer', () => {
  it('should render sub components', async () => {
    const { findAllByTestId } = jsonFormsTestHarness('',  <MaterialLayoutRenderer
      schema={jsonSchema}
      uischema={layout}
      direction="row"
      enabled
      visible
      path="" elements={layout.elements}  />);
    const input = await findAllByTestId("test-input");
    expect(input[0]).toBeInstanceOf(HTMLElement);
    expect(input.length).toEqual(3);
  });
});
