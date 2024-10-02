import { fn } from '@storybook/test';
import Palette from "./Palette.jsx";
import ThemeDecorator from "../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../app/const/theme.js";


export default {
  title: 'ui/Palette',
  component: Palette,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {  },
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

