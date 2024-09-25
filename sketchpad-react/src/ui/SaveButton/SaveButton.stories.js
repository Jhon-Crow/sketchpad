import { fn } from '@storybook/test';
import SaveButton from "./SaveButton.jsx";


export default {
  title: 'Example/Button',
  component: SaveButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
  },
};

// export const Secondary = {
//   args: {
//     label: 'Button',
//   },
// };

