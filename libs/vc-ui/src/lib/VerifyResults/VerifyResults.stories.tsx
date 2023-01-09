import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { validChecks } from '../fixtures';
import { VerifyResults } from './VerifyResults';

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
  issuer: { id: 'demo.tradetrust.io', name: 'Demo' },
  errors: [],
  warnings: [],
  checks: validChecks,
};

export const Invalid = Template.bind({});
Invalid.args = { errors: ['INTEGRITY'] };
