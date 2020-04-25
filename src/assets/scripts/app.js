/* eslint-disable no-new */
import embed from './modules/embed';
import ColorScheme from './modules/color-scheme';

embed();

if (window.CSS && CSS.supports('color', 'var(--value)')) {
  new ColorScheme();
}
