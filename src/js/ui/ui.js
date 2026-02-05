/**
 * UI Manager
 * Handles all UI interactions and rendering
 */

export class UIManager {
    constructor() {
        this.elements = {};
        this.state = {
            selectedMood: null,
            currentPlan: null
        };
    }

    init(app) {
        this.app = app;
        this.cacheElements();
        this.attachEventListeners();
        this.initializeSliders();
    }

    cacheElements() {
        // Views
        this.elements.generatorView = document.getElementById('generatorView');
        this.elements.planView = document.getElementById('planView');
        this.elements.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Form elements
        this.elements.generatorForm = document.getElementById('generatorForm');
        this.elements.durationSlider = document.getElementById('duration');
        this.elements.durationDisplay = document.querySelector('.duration-display');
        this.elements.surpriseSlider = document.getElementById('surprise');
        this.elements.surpriseDisplay = document.querySelector('.surprise-display');
        this.elements.weightLilith = document.getElementById('weightLilith');
        this.elements.weightHaziel = document.getElementById('weightHaziel');
        
        // Buttons
        this.elements.generateBtn = document.getElementById('generateBtn');
        this.elements.surpriseBtn = document.getElementById('surpriseBtn');
        this.elements.backBtn = document.getElementById('backBtn');
        this.elements.shareBtn = document.getElementById('shareBtn');
        this.elements.exportBtn = document.getElementById('exportBtn');
        this.elements.regenerateBtn = document.getElementById('regenerateBtn');
        
        // Plan elements
        this.elements.planTitle = document.getElementById('planTitle');
        this.elements.planReasoning = document.getElementById('planReasoning');
        this.elements.timeline = document.getElementById('timeline');
        this.elements.checklistModal = document.getElementById('checklistModal');
        this.elements.checklistItems = document.getElementById('checklistItems');
        this.elements.startPlanBtn = document.getElementById('startPlanBtn');
        
        // Toast
        this.elements.toastContainer = document.getElementById('toastContainer');
    }

    attachEventListeners() {
        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMoodSelect(btn);
            });
        });
        
        // Form submission
        this.elements.generatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGenerate();
        });
        
        // Surprise button (auto-generate with random params)
        this.elements.surpriseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSurpriseGenerate();
        });
        
        // Back button
        this.elements.backBtn.addEventListener('click', () => {
            this.app.backToGenerator();
        });
        
        // Share button
        this.elements.shareBtn.addEventListener('click', () => {
            this.app.sharePlan();
        });
        
        // Export button
        this.elements.exportBtn.addEventListener('click', () => {
            this.handleExport();
        });
        
        // Regenerate button
        this.elements.regenerateBtn.addEventListener('click', () => {
            this.handleGenerate();
        });
        
        // Checklist start button
        this.elements.startPlanBtn.addEventListener('click', () => {
            this.elements.checklistModal.classList.add('hidden');
        });
        
        // Overall plan feedback
        document.querySelectorAll('.btn-feedback').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handlePlanFeedback(btn.dataset.rating);
            });
        });
    }

    initializeSliders() {
        // Duration slider
        this.elements.durationSlider.addEventListener('input', (e) => {
            this.updateDurationDisplay(e.target.value);
        });
        
        // Surprise slider
        this.elements.surpriseSlider.addEventListener('input', (e) => {
            this.updateSurpriseDisplay(e.target.value);
        });
        
        // Weight sliders
        this.elements.weightLilith.addEventListener('input', (e) => {
            this.updateWeightDisplay('lilith', e.target.value);
        });
        
        this.elements.weightHaziel.addEventListener('input', (e) => {
            this.updateWeightDisplay('haziel', e.target.value);
        });
        
        // Initialize displays
        this.updateDurationDisplay(this.elements.durationSlider.value);
        this.updateSurpriseDisplay(this.elements.surpriseSlider.value);
        this.updateWeightDisplay('lilith', this.elements.weightLilith.value);
        this.updateWeightDisplay('haziel', this.elements.weightHaziel.value);
    }

    handleMoodSelect(button) {
        // Remove active class from all mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        button.classList.add('active');
        this.state.selectedMood = button.dataset.mood;
    }

    updateDurationDisplay(value) {
        const minutes = parseInt(value);
        let display;
        
        if (minutes < 60) {
            display = `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            display = mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
        }
        
        this.elements.durationDisplay.textContent = display;
    }

    updateSurpriseDisplay(value) {
        const level = parseInt(value);
        let display;
        
        if (level < 25) display = 'Lo de siempre';
        else if (level < 50) display = 'Balanceado';
        else if (level < 75) display = 'Aventurero';
        else display = 'Sorpresa total';
        
        this.elements.surpriseDisplay.textContent = display;
    }

    updateWeightDisplay(person, value) {
        const display = document.querySelector(`#weight${person.charAt(0).toUpperCase() + person.slice(1)} ~ .weight-value`);
        if (display) {
            display.textContent = `${value}%`;
        }
    }

    handleGenerate() {
        const formData = this.collectFormData();
        
        if (!formData.mood) {
            this.showToast('Por favor selecciona cómo se sienten hoy', 'error');
            return;
        }
        
        this.app.generatePlan(formData);
    }

    handleSurpriseGenerate() {
        // Auto-select random mood
        const moods = ['tired', 'energetic', 'calm', 'fun'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        
        // Find and click the mood button
        const moodBtn = document.querySelector(`[data-mood="${randomMood}"]`);
        if (moodBtn) {
            moodBtn.click();
        }
        
        // Set surprise to high
        this.elements.surpriseSlider.value = 75;
        this.updateSurpriseDisplay(75);
        
        // Generate immediately
        setTimeout(() => {
            this.handleGenerate();
        }, 300);
    }

    collectFormData() {
        // Get filters
        const constraints = {
            location: Array.from(document.querySelectorAll('input[name="location"]:checked')).map(el => el.value),
            intensity: Array.from(document.querySelectorAll('input[name="intensity"]:checked')).map(el => el.value),
            cost: Array.from(document.querySelectorAll('input[name="cost"]:checked')).map(el => el.value)
        };
        
        return {
            targetMin: parseInt(this.elements.durationSlider.value),
            surprise: parseInt(this.elements.surpriseSlider.value),
            weights: {
                lilith: parseInt(this.elements.weightLilith.value),
                haziel: parseInt(this.elements.weightHaziel.value)
            },
            constraints: constraints,
            mood: this.state.selectedMood,
            timeOfDay: this.getTimeOfDay()
        };
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    showGeneratorView() {
        this.elements.generatorView.classList.remove('hidden');
        this.elements.planView.classList.add('hidden');
    }

    renderPlan(plan) {
        this.state.currentPlan = plan;
        
        // Update plan header
        this.elements.planTitle.textContent = plan.title;
        this.elements.planReasoning.textContent = plan.reasoning;
        
        // Render checklist if there are required assets
        if (plan.requiredAssets && plan.requiredAssets.length > 0) {
            this.renderChecklist(plan.requiredAssets);
            this.elements.checklistModal.classList.remove('hidden');
        }
        
        // Render timeline
        this.renderTimeline(plan.activities);
        
        // Switch views
        this.elements.generatorView.classList.add('hidden');
        this.elements.planView.classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderChecklist(assets) {
        this.elements.checklistItems.innerHTML = assets.map(asset => 
            `<li>${asset}</li>`
        ).join('');
    }

    renderTimeline(activities) {
        this.elements.timeline.innerHTML = activities.map((activity, index) => {
            if (activity.isTransition) {
                return this.renderTransition(activity);
            }
            return this.renderActivity(activity, index);
        }).join('');
        
        // Attach feedback listeners
        this.attachActivityFeedbackListeners();
    }

    renderActivity(activity, index) {
        const steps = activity.steps || [];
        const hasSteps = steps.length > 0;
        
        return `
            <div class="timeline-item" data-activity-id="${activity.id}">
                <div class="timeline-marker"></div>
                <div class="timeline-card">
                    <div class="timeline-header">
                        <div class="timeline-time">${this.formatTime(activity.startTime)}</div>
                        <div class="timeline-duration">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                            ${activity.duration} min
                        </div>
                    </div>
                    <h3 class="timeline-title">${activity.title}</h3>
                    <p class="timeline-description">${activity.description}</p>
                    
                    ${activity.required_assets && activity.required_assets.length > 0 ? `
                        <div class="timeline-assets">
                            <h4>Necesitan:</h4>
                            <div class="asset-list">
                                ${activity.required_assets.map(asset => 
                                    `<span class="asset-tag">${asset}</span>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${hasSteps ? `
                        <div class="timeline-steps">
                            <h4>Pasos:</h4>
                            <ol class="step-list">
                                ${steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}
                    
                    <div class="activity-feedback">
                        <button class="feedback-btn feedback-thumbs-up" data-feedback="thumbs-up">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                            </svg>
                            Me gustó
                        </button>
                        <button class="feedback-btn feedback-thumbs-down" data-feedback="thumbs-down">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                            </svg>
                            No me gustó
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderTransition(transition) {
        return `
            <div class="timeline-item transition-item">
                <div class="timeline-marker"></div>
                <div class="timeline-card" style="opacity: 0.7;">
                    <div class="timeline-header">
                        <div class="timeline-time">${this.formatTime(transition.startTime)}</div>
                        <div class="timeline-duration">${transition.duration} min</div>
                    </div>
                    <p class="timeline-description" style="font-style: italic;">${transition.description}</p>
                </div>
            </div>
        `;
    }

    formatTime(minutes) {
        if (!minutes && minutes !== 0) return '';
        
        const now = new Date();
        const futureTime = new Date(now.getTime() + minutes * 60000);
        
        return futureTime.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
    }

    attachActivityFeedbackListeners() {
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityCard = e.target.closest('.timeline-item');
                const activityId = activityCard.dataset.activityId;
                const feedbackType = btn.dataset.feedback;
                
                this.handleActivityFeedback(activityId, feedbackType, btn);
            });
        });
    }

    handleActivityFeedback(activityId, feedbackType, button) {
        if (!activityId) return;
        
        // Toggle active state
        const wasActive = button.classList.contains('active');
        
        // Remove active from siblings
        const siblings = button.parentElement.querySelectorAll('.feedback-btn');
        siblings.forEach(btn => btn.classList.remove('active'));
        
        if (!wasActive) {
            button.classList.add('active');
            
            // Save feedback
            this.app.saveFeedback(
                this.state.currentPlan.id,
                activityId,
                { type: feedbackType }
            );
            
            this.showToast('¡Gracias por tu feedback!', 'success');
        }
    }

    handlePlanFeedback(rating) {
        if (!this.state.currentPlan) return;
        
        this.app.storage.savePlanFeedback(this.state.currentPlan.id, rating);
        this.showToast('¡Gracias! Esto nos ayuda a mejorar', 'success');
    }

    async handleExport() {
        if (!this.state.currentPlan) return;
        
        try {
            const { exportToICS } = await import('./utils/icsExport.js');
            const icsContent = exportToICS(this.state.currentPlan);
            
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `plan-${new Date().toISOString().split('T')[0]}.ics`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            this.showToast('¡Calendario exportado!', 'success');
        } catch (error) {
            console.error('Error exporting:', error);
            this.showToast('Error al exportar', 'error');
        }
    }

    showLoading(show) {
        if (show) {
            this.elements.loadingOverlay.classList.remove('hidden');
        } else {
            this.elements.loadingOverlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}
