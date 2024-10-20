import ColorCell from "./ColorCell.jsx";
import ThemeDecorator from "../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../app/const/theme.js";


export default {
  title: 'ui/ColorCell',
  component: ColorCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { initialColor: '#375891' },
};

export const Light = {
  args: {

  },
};
Light.decorators = [ThemeDecorator(Theme.light)]
// export const Dark = {
//   args: {
//
//   },
// };
// Dark.decorators = [ThemeDecorator(Theme.dark)]

