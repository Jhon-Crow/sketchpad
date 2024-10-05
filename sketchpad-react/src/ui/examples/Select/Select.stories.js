import {Select} from "./Select.jsx";
import ThemeDecorator from "../../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../../app/const/theme.js";

const options = [
  {value: 1, content: 'AREAL'},
  {value: 2, content: 'ROBOT'},
  {value: 3, content: 'COMIC SANS'},
]

export default {
  title: 'examples/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    options: options,
    fontColor: '#377D5E'
  },
};

export const Light = {
  args: {
    // isLight: true
  },
};
Light.decorators = [ThemeDecorator(Theme.light)]
export const Dark = {
  args: {
    // isLight: false
  },
};
Dark.decorators = [ThemeDecorator(Theme.dark)]

