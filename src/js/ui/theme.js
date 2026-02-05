/**
 * Theme Manager
 * Handles dark/light theme switching with persistence
 */

export class ThemeManager {
    constructor() {
        this.STORAGE_KEY = 'theme_preference';
        this.currentTheme = this.loadTheme();
    }

    init() {
        // Apply theme immediately to avoid flash
        this.applyTheme(this.currentTheme);
        
        // Attach toggle listener
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    loadTheme() {
        // Check localStorage first
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            return stored;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        // Default to dark
        return 'dark';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }

    saveTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    // Listen for system theme changes
    watchSystemTheme() {
        if (!window.matchMedia) return;
        
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't set a preference
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}
