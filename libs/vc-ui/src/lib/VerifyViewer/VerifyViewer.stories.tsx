import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { IStatusCheck } from '..';
import { CHAFTA_COO } from '../fixtures';
import { VerifyViewer } from './VerifyViewer';

const Story: ComponentMeta<typeof VerifyViewer> = {
  component: VerifyViewer,
  title: 'VerifyViewer',
};
export default Story;

const validChecks: IStatusCheck[] = [
  {
    type: 'INTEGRITY',
    text: 'Document has not been tampered with',
    valid: true,
  },
  {
    type: 'STATUS',
    text: 'Document has not been revoked',
    valid: true,
  },
  {
    type: 'ISSUER',
    text: 'Document issuer has been identified',
    valid: true,
  },
];

const Template: ComponentStory<typeof VerifyViewer> = (args) => (
  <VerifyViewer {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  document: CHAFTA_COO,
  results: {
    errors: [],
    issuer: { id: '123', name: 'Demo Issuer' },
    checks: validChecks,
    warnings: [],
  },
};
