import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChooseForm } from './ChooseForm';
import { Form } from '../index';

const Story: ComponentMeta<typeof ChooseForm> = {
  component: ChooseForm,
  title: 'ChooseForm',
};
export default Story;

const Template: ComponentStory<typeof ChooseForm> = (args) => (
  <ChooseForm {...args} />
);

export const Primary = Template.bind({});

const form = {
  schema: {},
  uiSchema: {},
};

Primary.args = {
  form: { id: '001', name: 'sampleForm', fullForm: form, partialForm: form },
  onSelected: (form: Form | undefined) => {
    return;
  },
};
