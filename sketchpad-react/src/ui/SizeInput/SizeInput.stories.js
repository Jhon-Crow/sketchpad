import SizeInput from "./SizeInput.jsx";
import ThemeDecorator from "../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../app/const/theme.js";


export default {
  title: 'ui/SizeInput',
  component: SizeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {   },

};

export const Light = {
  args: {
  },
};
Light.decorators = [ThemeDecorator(Theme.light)]
export const Dark = {
  args: {
  },
};
Dark.decorators = [ThemeDecorator(Theme.dark)]

