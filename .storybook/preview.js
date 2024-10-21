import {StyleDecorator} from "./decorators/styleDecorator.jsx";
import ThemeDecorator from "./decorators/themeDecorator.jsx";
import {Theme} from "../src/app/const/theme.js";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
     StyleDecorator,
      // ThemeDecorator(Theme.dark)
  ],
};

export default preview;
