import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FooBar } from './FooBar';

const Story: ComponentMeta<typeof FooBar> = {
  component: FooBar,
  title: 'FooBar',
};
export default Story;

const Template: ComponentStory<typeof FooBar> = (args) => <FooBar {...args} />;

export const Primary = Template.bind({});
Primary.args = { message: 'FooBar' };
