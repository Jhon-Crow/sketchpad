import { fn } from '@storybook/test';
import SaveButton from "./SaveButton.jsx";
import ThemeDecorator from "../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../app/const/theme.js";


export default {
  title: 'Example/Button',
  component: SaveButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const Light = {
  args: {
    isLight: true
  },
};
Light.decorators = [ThemeDecorator(Theme.light)]
export const Dark = {
  args: {
    isLight: false
  },
};
Dark.decorators = [ThemeDecorator(Theme.dark)]

