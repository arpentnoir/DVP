import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Route } from 'react-router-dom';
import { FormSelect, FormOption } from './FormSelect';
import { RouterWrapper } from '../../utils';

const Story: ComponentMeta<typeof FormSelect> = {
  component: FormSelect,
  title: 'FormSelect',
};
export default Story;

const Template: ComponentStory<typeof FormSelect> = (args) => (
  <RouterWrapper>
    <Route path="/*" element={<FormSelect {...args} />} />
  </RouterWrapper>
);

export const Primary = Template.bind({});

const form = {
  schema: {},
  uiSchema: {},
};

Primary.args = {
  forms: [{ id: '001', name: 'sampleForm', fullForm: form, partialForm: form }],
  onFormSelected: (value: FormOption) => {
    return;
  },
};
