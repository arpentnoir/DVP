import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { CertificateUpload } from './CertificateUpload';

const Story: ComponentMeta<typeof CertificateUpload> = {
  component: CertificateUpload,
  title: 'CertificateUpload',
};
export default Story;

const Template: ComponentStory<typeof CertificateUpload> = (args) => (
  <CertificateUpload {...args} />
);

export const Primary = Template.bind({});
