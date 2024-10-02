import React from 'react';

export const ThemeDecorator = (Theme) => (StoryComponent) => (
    // <ThemeProvider initialTheme={theme}>
        <div className={`App ${Theme}`}>
            <StoryComponent />
        </div>
    // </ThemeProvider>
);

export default ThemeDecorator;