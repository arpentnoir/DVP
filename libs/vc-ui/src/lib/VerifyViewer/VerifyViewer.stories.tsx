import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { VerifyViewer } from './VerifyViewer';
import { CHAFTA_COO } from '../fixtures';
import { IStatusCheck } from '..';

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
    issuer: 'testing123',
    checks: validChecks,
    warnings: [],
  },
};
