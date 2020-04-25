const STORAGE_KEY = 'colorScheme';
const COLOR_SCHEME_KEY = '--color-scheme';

export default class {
  constructor() {
    this.toggleBtn = document.querySelector('[data-toggle="color-scheme"]');
    this.lightIcon = this.toggleBtn.querySelector('.color-scheme__light-icon');
    this.darkIcon = this.toggleBtn.querySelector('.color-scheme__dark-icon');
    this.lightIcon.hidden = false;
    this.isActive = false;

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    this.init();
  }

  getSystemPreference() {
    const response = getComputedStyle(
      document.documentElement
    ).getPropertyValue(COLOR_SCHEME_KEY);

    if (response.length !== 0) {
      return response.replace(/"/g, '').trim();
    }

    return null;
  }

  init() {
    if (this.hasLocalStorage()) {
      const systemPreference = this.getSystemPreference();
      const storedSetting = localStorage.getItem(STORAGE_KEY);

      let preference;
      if (storedSetting) {
        preference = storedSetting === 'true';
      } else if (systemPreference) {
        preference = systemPreference === 'dark';
      }

      this.toggle(preference);
    }
  }

  toggle(force) {
    this.isActive = typeof force === 'boolean' ? force : !this.isActive;
    this.darkIcon.hidden = !this.isActive;
    this.lightIcon.hidden = this.isActive;
    this.toggleBtn.setAttribute('aria-checked', String(this.isActive));

    document.documentElement.dataset.colorScheme = this.isActive;

    if (this.hasLocalStorage()) {
      localStorage.setItem(STORAGE_KEY, this.isActive);
    }
  }

  hasLocalStorage() {
    return typeof Storage !== 'undefined';
  }
}
