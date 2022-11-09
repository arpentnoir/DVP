import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { VerifyResults } from './VerifyResults';
import { validChecks } from '../fixtures';

const Story: ComponentMeta<typeof VerifyResults> = {
  component: VerifyResults,
  title: 'VerifyResults',
};
export default Story;

const Template: ComponentStory<typeof VerifyResults> = (args) => (
  <VerifyResults {...args} />
);

export const Valid = Template.bind({});

Valid.args = {
  issuer: 'demo.tradetrust.io',
  errors: [],
  warnings: [],
  checks: validChecks,
};

export const Invalid = Template.bind({});
Invalid.args = { errors: ['INTEGRITY'] };
