import { globalStyle, createTheme, createThemeContract } from '@vanilla-extract/css';

// CSS変数の定義
export const vars = createThemeContract({
  color: {
    background: null,
    foreground: null,
  },
});

// ライトテーマ
export const lightTheme = createTheme(vars, {
  color: {
    background: '#ffffff',
    foreground: '#171717',
  },
});

// ダークテーマ
export const darkTheme = createTheme(vars, {
  color: {
    background: '#0a0a0a',
    foreground: '#ededed',
  },
});

// グローバルスタイル
globalStyle('html, body', {
  maxWidth: '100vw',
  overflowX: 'hidden',
});

globalStyle('body', {
  color: vars.color.foreground,
  background: vars.color.background,
  fontFamily: 'Arial, Helvetica, sans-serif',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('*', {
  boxSizing: 'border-box',
  padding: 0,
  margin: 0,
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('html', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      colorScheme: 'dark',
    },
  },
});
