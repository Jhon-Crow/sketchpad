import { fn } from '@storybook/test';
import CapsLockIdentifier from "./CapsLockIdentifier.jsx";
import ThemeDecorator from "../../../.storybook/decorators/themeDecorator.jsx";
import {Theme} from "../../app/const/theme.js";


export default {
  title: 'ui/CapsLockIdentifier',
  component: CapsLockIdentifier,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { capsLockPressed: true },
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

