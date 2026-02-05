/**
 * Storage Manager
 * Handles all local storage operations (localStorage and IndexedDB)
 */

export class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            PLAN_HISTORY: 'plan_history',
            ACTIVITY_FEEDBACK: 'activity_feedback',
            PLAN_FEEDBACK: 'plan_feedback',
            USER_PREFERENCES: 'user_preferences',
            HEURISTICS: 'planner_heuristics'
        };
        
        this.MAX_HISTORY_SIZE = 50; // Keep last 50 plans
    }

    /**
     * Save a plan to history
     */
    savePlanToHistory(plan) {
        try {
            const history = this.getPlanHistory();
            
            // Add new plan at the beginning
            history.unshift({
                id: plan.id,
                title: plan.title,
                reasoning: plan.reasoning,
                totalDuration: plan.totalDuration,
                generatedAt: plan.generatedAt,
                parameters: plan.parameters,
                activityCount: plan.activities.length
            });
            
            // Trim to max size
            const trimmed = history.slice(0, this.MAX_HISTORY_SIZE);
            
            localStorage.setItem(this.STORAGE_KEYS.PLAN_HISTORY, JSON.stringify(trimmed));
            
            return true;
        } catch (error) {
            console.error('Error saving plan to history:', error);
            return false;
        }
    }

    /**
     * Get plan history
     */
    getPlanHistory() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEYS.PLAN_HISTORY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting plan history:', error);
            return [];
        }
    }

    /**
     * Save activity feedback
     */
    saveFeedback(planId, activityId, feedback) {
        try {
            // Get existing feedback
            const allFeedback = this.getActivityFeedback();
            
            // Initialize activity feedback if doesn't exist
            if (!allFeedback[activityId]) {
                allFeedback[activityId] = {
                    thumbsUp: 0,
                    thumbsDown: 0,
                    completed: 0,
                    skipped: 0,
                    totalTime: 0,
                    instances: []
                };
            }
            
            const activityFeedback = allFeedback[activityId];
            
            // Update counters based on feedback type
            if (feedback.type === 'thumbs-up') {
                activityFeedback.thumbsUp++;
            } else if (feedback.type === 'thumbs-down') {
                activityFeedback.thumbsDown++;
            } else if (feedback.type === 'completed') {
                activityFeedback.completed++;
            } else if (feedback.type === 'skipped') {
                activityFeedback.skipped++;
            }
            
            // Record instance
            activityFeedback.instances.push({
                planId: planId,
                timestamp: new Date().toISOString(),
                feedback: feedback
            });
            
            // Keep only last 20 instances
            if (activityFeedback.instances.length > 20) {
                activityFeedback.instances = activityFeedback.instances.slice(-20);
            }
            
            // Save back
            localStorage.setItem(
                this.STORAGE_KEYS.ACTIVITY_FEEDBACK,
                JSON.stringify(allFeedback)
            );
            
            return true;
        } catch (error) {
            console.error('Error saving feedback:', error);
            return false;
        }
    }

    /**
     * Get activity feedback data
     */
    getActivityFeedback() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_FEEDBACK);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error getting activity feedback:', error);
            return {};
        }
    }

    /**
     * Save plan-level feedback
     */
    savePlanFeedback(planId, rating, comment = '') {
        try {
            const allFeedback = this.getPlanFeedback();
            
            allFeedback[planId] = {
                rating: rating,
                comment: comment,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(
                this.STORAGE_KEYS.PLAN_FEEDBACK,
                JSON.stringify(allFeedback)
            );
            
            return true;
        } catch (error) {
            console.error('Error saving plan feedback:', error);
            return false;
        }
    }

    /**
     * Get plan feedback
     */
    getPlanFeedback() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEYS.PLAN_FEEDBACK);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error getting plan feedback:', error);
            return {};
        }
    }

    /**
     * Save user preferences
     */
    savePreferences(preferences) {
        try {
            localStorage.setItem(
                this.STORAGE_KEYS.USER_PREFERENCES,
                JSON.stringify(preferences)
            );
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    }

    /**
     * Get user preferences
     */
    getPreferences() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
            return stored ? JSON.parse(stored) : this.getDefaultPreferences();
        } catch (error) {
            console.error('Error getting preferences:', error);
            return this.getDefaultPreferences();
        }
    }

    /**
     * Get default preferences
     */
    getDefaultPreferences() {
        return {
            theme: 'dark',
            defaultDuration: 60,
            defaultSurprise: 30,
            defaultWeights: {
                lilith: 50,
                haziel: 50
            }
        };
    }

    /**
     * Clear all data (for testing/reset)
     */
    clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('All storage cleared');
    }

    /**
     * Get storage usage info
     */
    getStorageInfo() {
        const info = {};
        
        Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
            const data = localStorage.getItem(key);
            info[name] = {
                size: data ? data.length : 0,
                sizeKB: data ? (data.length / 1024).toFixed(2) : 0
            };
        });
        
        return info;
    }

    /**
     * Export all data as JSON
     */
    exportData() {
        const data = {};
        
        Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
            const stored = localStorage.getItem(key);
            data[name] = stored ? JSON.parse(stored) : null;
        });
        
        return data;
    }

    /**
     * Import data from JSON
     */
    importData(data) {
        try {
            Object.entries(data).forEach(([name, value]) => {
                const key = this.STORAGE_KEYS[name];
                if (key && value !== null) {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}
