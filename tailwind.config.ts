import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|calendar|date-picker|dropdown|popover|button|ripple|spinner|input|listbox|divider|scroll-shadow|date-input|menu).js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};

export default config;