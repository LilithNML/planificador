/**
 * Main Application Entry Point
 * Handles initialization, routing, and global state
 */

import { UIManager } from './ui/ui.js';
import { ThemeManager } from './ui/theme.js';
import { PlanGenerator } from './planner.js';
import { StorageManager } from './store.js';

class App {
    constructor() {
        this.ui = new UIManager();
        this.theme = new ThemeManager();
        this.planner = new PlanGenerator();
        this.storage = new StorageManager();
        
        this.state = {
            currentView: 'generator',
            currentPlan: null,
            profiles: null,
            activities: null,
            loaded: false
        };
    }

    async init() {
        try {
            // Initialize theme first (avoid flash)
            this.theme.init();
            
            // Load data
            await this.loadData();
            
            // Initialize UI
            this.ui.init(this);
            
            // Handle URL parameters (for shared plans)
            this.handleURLParams();
            
            // Mark as loaded
            this.state.loaded = true;
            
            console.log('✓ App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.ui.showToast('Error al cargar la aplicación', 'error');
        }
    }

    async loadData() {
        try {
            // Load profiles
            const [lilithProfile, hazielProfile] = await Promise.all([
                fetch('data/profiles/lilith.json').then(r => r.json()),
                fetch('data/profiles/haziel.json').then(r => r.json())
            ]);
            
            this.state.profiles = {
                lilith: lilithProfile,
                haziel: hazielProfile
            };

            // Load activities index
            const activitiesIndex = await fetch('data/index.json').then(r => r.json());
            
            // Load all activity files
            const activityFiles = await Promise.all(
                activitiesIndex.files.map(file => 
                    fetch(`data/${file}`).then(r => r.json())
                )
            );
            
            // Merge all activities
            this.state.activities = activityFiles.flat();
            
            console.log(`✓ Loaded ${this.state.activities.length} activities`);
            console.log('✓ Loaded profiles:', Object.keys(this.state.profiles));
            
        } catch (error) {
            console.error('Error loading data:', error);
            throw new Error('No se pudieron cargar los datos necesarios');
        }
    }

    handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const sharedPlan = params.get('plan');
        
        if (sharedPlan) {
            try {
                const decodedPlan = this.decodePlan(sharedPlan);
                this.showPlan(decodedPlan);
            } catch (error) {
                console.error('Error loading shared plan:', error);
                this.ui.showToast('No se pudo cargar el plan compartido', 'error');
            }
        }
    }

    async generatePlan(params) {
        try {
            this.ui.showLoading(true);
            
            // Generate plan using planner
            const plan = await this.planner.generatePlan({
                ...params,
                profiles: this.state.profiles,
                activities: this.state.activities
            });
            
            this.state.currentPlan = plan;
            
            // Save to history
            this.storage.savePlanToHistory(plan);
            
            this.ui.showLoading(false);
            this.showPlan(plan);
            
        } catch (error) {
            console.error('Error generating plan:', error);
            this.ui.showLoading(false);
            this.ui.showToast('Error al generar el plan. Intenta de nuevo.', 'error');
        }
    }

    showPlan(plan) {
        this.state.currentView = 'plan';
        this.state.currentPlan = plan;
        this.ui.renderPlan(plan);
    }

    backToGenerator() {
        this.state.currentView = 'generator';
        this.ui.showGeneratorView();
    }

    sharePlan() {
        if (!this.state.currentPlan) return;
        
        const encoded = this.encodePlan(this.state.currentPlan);
        const url = `${window.location.origin}${window.location.pathname}?plan=${encoded}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Plan para dos',
                text: this.state.currentPlan.reasoning,
                url: url
            }).catch(() => {
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.ui.showToast('¡Enlace copiado!', 'success');
        }).catch(() => {
            this.ui.showToast('No se pudo copiar el enlace', 'error');
        });
    }

    encodePlan(plan) {
        // Encode plan to base64 for URL sharing (without full profiles)
        const shareable = {
            title: plan.title,
            reasoning: plan.reasoning,
            activities: plan.activities,
            totalDuration: plan.totalDuration,
            generatedAt: plan.generatedAt
        };
        
        return btoa(JSON.stringify(shareable));
    }

    decodePlan(encoded) {
        return JSON.parse(atob(encoded));
    }

    saveFeedback(planId, activityId, feedback) {
        this.storage.saveFeedback(planId, activityId, feedback);
        
        // Update planner heuristics based on feedback
        this.planner.updateHeuristics(feedback);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new App();
        window.app.init();
    });
} else {
    window.app = new App();
    window.app.init();
}

export { App };
