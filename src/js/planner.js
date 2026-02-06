/**
 * Plan Generator - Core Planning Engine
 * Implements activity scoring, selection, and sequencing algorithms
 */

import { scoringEngine } from './scoring.js';

export class PlanGenerator {
    constructor() {
        this.heuristics = this.loadHeuristics();
    }

    loadHeuristics() {
        // Load or initialize heuristics from localStorage
        const stored = localStorage.getItem('planner_heuristics');
        if (stored) {
            return JSON.parse(stored);
        }
        
        return {
            // Base weights for different factors
            tagMatchWeight: 1.0,
            intensityMatchWeight: 0.7,
            varietyBonus: 0.5,
            recencyPenalty: 0.3,
            feedbackWeight: 1.2,
            
            // Transition preferences
            minTransitionTime: 2,
            maxTransitionTime: 5,
            
            // Surprise mixing
            surpriseLevels: {
                safe: { known: 0.9, variant: 0.1, new: 0.0 },
                balanced: { known: 0.7, variant: 0.2, new: 0.1 },
                adventurous: { known: 0.5, variant: 0.3, new: 0.2 },
                wild: { known: 0.3, variant: 0.3, new: 0.4 }
            }
        };
    }

    saveHeuristics() {
        localStorage.setItem('planner_heuristics', JSON.stringify(this.heuristics));
    }

    updateHeuristics(feedback) {
        // Adjust heuristics based on user feedback
        // This is a simple implementation - could be much more sophisticated
        
        if (feedback.rating === 'love') {
            this.heuristics.feedbackWeight *= 1.05;
        } else if (feedback.rating === 'bad') {
            this.heuristics.feedbackWeight *= 0.95;
        }
        
        this.saveHeuristics();
    }

    /**
     * Main plan generation function
     * @param {Object} params - Generation parameters
     * @returns {Object} - Generated plan
     */
    async generatePlan(params) {
        const {
            targetMin,
            profiles,
            weights,
            constraints,
            surprise,
            mood,
            timeOfDay
        } = params;

        console.log('Generating plan with params:', params);

        // Step 1: Filter activities based on constraints
        let pool = this.filterActivities(params.activities, constraints, mood);
        
        console.log(`Filtered to ${pool.length} activities`);

        // Step 2: Score all activities
        pool = this.scoreActivities(pool, profiles, weights, surprise, mood, timeOfDay);
        
        // Step 3: Get recent activity history to avoid repetition
        const recentActivities = this.getRecentActivities();
        
        // Step 4: Apply recency penalty
        pool = this.applyRecencyPenalty(pool, recentActivities);
        
        // Step 5: Sort by score
        pool.sort((a, b) => b.score - a.score);
        
        console.log('Top 5 scored activities:', pool.slice(0, 5).map(a => ({
            title: a.title,
            score: a.score
        })));

        // Step 6: Select sequence using greedy knapsack
        let sequence = this.selectSequence(pool, targetMin, surprise);
        
        // Step 7: Insert transitions
        sequence = this.insertTransitions(sequence);
        
        // Step 8: Fill small gaps if needed
        sequence = this.fillGaps(sequence, targetMin, pool);

        // Inject dynamic content (YouTube, etc.)
sequence = sequence.map(activity =>
    this.injectDynamicContent(
        activity,
        [
            { profile: profiles.lilith, weight: weights.lilith / 100 },
            { profile: profiles.haziel, weight: weights.haziel / 100 }
        ],
        mood
    )
);
        
        // Step 9: Generate reasoning/explanation
        const reasoning = this.generateReasoning(params, sequence);
        
        // Step 10: Collect required assets
        const requiredAssets = this.collectAssets(sequence);
        
        // Step 11: Create final plan object
        const plan = {
            id: this.generatePlanId(),
            title: this.generateTitle(mood, sequence),
            reasoning: reasoning,
            activities: sequence,
            totalDuration: sequence.reduce((sum, a) => sum + a.duration, 0),
            requiredAssets: requiredAssets,
            generatedAt: new Date().toISOString(),
            parameters: {
                mood,
                targetMin,
                surprise,
                weights
            }
        };

        return plan;
    }

    filterActivities(activities, constraints, mood) {
        return activities.filter(activity => {
            // Filter by location
            if (constraints.location && constraints.location.length > 0) {
                const hasIndoor = constraints.location.includes('indoor');
                const hasOutdoor = constraints.location.includes('outdoor');
                
                if (hasIndoor && !hasOutdoor && activity.tags.includes('outdoor')) {
                    return false;
                }
                if (hasOutdoor && !hasIndoor && activity.tags.includes('indoor')) {
                    return false;
                }
            }
            
            // Filter by intensity
            if (constraints.intensity && constraints.intensity.length > 0) {
                const allowedIntensities = constraints.intensity.map(i => parseInt(i));
                if (!allowedIntensities.includes(activity.intensity)) {
                    return false;
                }
            }
            
            // Filter by cost
            if (constraints.cost && constraints.cost.length > 0) {
                if (constraints.cost.includes('free') && !constraints.cost.includes('paid')) {
                    if (activity.cost > 0) return false;
                }
                if (constraints.cost.includes('paid') && !constraints.cost.includes('free')) {
                    if (activity.cost === 0) return false;
                }
            }
            
            // Filter by mood compatibility
            if (mood) {
                const moodTags = {
                    tired: ['relaxing', 'passive', 'low-energy', 'calm'],
                    energetic: ['active', 'high-energy', 'dynamic', 'exercise'],
                    calm: ['peaceful', 'quiet', 'meditative', 'relaxing'],
                    fun: ['playful', 'funny', 'entertaining', 'social']
                };
                
                const desiredTags = moodTags[mood] || [];
                if (desiredTags.length > 0) {
                    const hasMatch = activity.tags.some(tag => 
                        desiredTags.some(desired => tag.includes(desired))
                    );
                    // Not a hard filter, but we'll boost these in scoring
                }
            }
            
            // Check participants requirement
            if (activity.participants && activity.participants > 2) {
                return false;
            }
            
            return true;
        });
    }

    scoreActivities(activities, profiles, weights, surprise, mood, timeOfDay) {
        const profileArray = [
            { profile: profiles.lilith, weight: weights.lilith / 100 },
            { profile: profiles.haziel, weight: weights.haziel / 100 }
        ];

        return activities.map(activity => {
            const score = scoringEngine.scoreActivity(
                activity,
                profileArray,
                this.heuristics,
                { mood, timeOfDay, surprise }
            );

            return {
                ...activity,
                score: score
            };
        });
    }

    getRecentActivities() {
        const history = JSON.parse(localStorage.getItem('plan_history') || '[]');
        const recentPlans = history.slice(-5); // Last 5 plans
        
        const recentActivityIds = new Set();
        recentPlans.forEach(plan => {
            if (plan.activities) {
                plan.activities.forEach(a => {
                    if (a.id) recentActivityIds.add(a.id);
                });
            }
        });
        
        return recentActivityIds;
    }

    applyRecencyPenalty(activities, recentIds) {
        return activities.map(activity => {
            if (recentIds.has(activity.id)) {
                return {
                    ...activity,
                    score: activity.score * (1 - this.heuristics.recencyPenalty)
                };
            }
            return activity;
        });
    }

    selectSequence(pool, targetMin, surprise) {
        // Determine surprise mix
        const surpriseLevel = this.getSurpriseLevel(surprise);
        const mix = this.heuristics.surpriseLevels[surpriseLevel];
        
        // Categorize activities by familiarity (simplified - would use feedback data)
        const categories = {
            known: pool.slice(0, Math.ceil(pool.length * 0.4)),
            variant: pool.slice(Math.ceil(pool.length * 0.4), Math.ceil(pool.length * 0.7)),
            new: pool.slice(Math.ceil(pool.length * 0.7))
        };
        
        // Build weighted pool
        const weightedPool = [
            ...this.sampleWithReplacement(categories.known, mix.known),
            ...this.sampleWithReplacement(categories.variant, mix.variant),
            ...this.sampleWithReplacement(categories.new, mix.new)
        ];
        
        // Greedy knapsack selection
        const selected = [];
        let totalTime = 0;
        const usedIds = new Set();
        
        for (const activity of weightedPool) {
            if (usedIds.has(activity.id)) continue;
            
            const duration = this.selectDuration(activity, targetMin - totalTime);
            
            if (totalTime + duration <= targetMin + 10) { // +10 min tolerance
                selected.push({
                    ...activity,
                    duration: duration,
                    startTime: null // Will be set when inserting transitions
                });
                
                totalTime += duration;
                usedIds.add(activity.id);
                
                if (totalTime >= targetMin - 10) { // -10 min tolerance
                    break;
                }
            }
        }
        
        return selected;
    }

    getSurpriseLevel(surpriseValue) {
        if (surpriseValue < 25) return 'safe';
        if (surpriseValue < 50) return 'balanced';
        if (surpriseValue < 75) return 'adventurous';
        return 'wild';
    }

    sampleWithReplacement(array, weight) {
        const count = Math.ceil(array.length * weight);
        return array.slice(0, count);
    }

    selectDuration(activity, remainingTime) {
        const min = activity.min_duration_min;
        const max = activity.max_duration_min;
        
        // Try to fit optimally within remaining time
        if (remainingTime < min) return min;
        if (remainingTime > max) return max;
        
        // Use a value closer to max if there's room
        return Math.min(max, Math.max(min, Math.floor(remainingTime * 0.7)));
    }

    insertTransitions(sequence) {
        if (sequence.length === 0) return sequence;
        
        const withTransitions = [];
        let currentTime = 0;
        
        sequence.forEach((activity, index) => {
            activity.startTime = currentTime;
            withTransitions.push(activity);
            currentTime += activity.duration;
            
            // Add transition if not last activity
            if (index < sequence.length - 1) {
                const transitionTime = this.calculateTransitionTime(activity, sequence[index + 1]);
                
                if (transitionTime > 0) {
                    withTransitions.push({
                        id: `transition_${index}`,
                        title: 'Transición',
                        description: this.generateTransitionDescription(activity, sequence[index + 1]),
                        duration: transitionTime,
                        startTime: currentTime,
                        isTransition: true,
                        tags: ['transition']
                    });
                    
                    currentTime += transitionTime;
                }
            }
        });
        
        return withTransitions;
    }

    calculateTransitionTime(from, to) {
        // Simple heuristic - could be much more sophisticated
        const hasLocationChange = 
            (from.tags.includes('indoor') && to.tags.includes('outdoor')) ||
            (from.tags.includes('outdoor') && to.tags.includes('indoor'));
        
        const hasIntensityChange = Math.abs(from.intensity - to.intensity) >= 2;
        
        if (hasLocationChange || hasIntensityChange) {
            return this.heuristics.maxTransitionTime;
        }
        
        return this.heuristics.minTransitionTime;
    }

    generateTransitionDescription(from, to) {
        const templates = [
            'Prepárense para la siguiente actividad',
            'Tomen un respiro antes de continuar',
            'Momento de cambiar de ritmo',
            'Hagan una pausa breve'
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    fillGaps(sequence, targetMin, pool) {
        const totalTime = sequence.reduce((sum, a) => sum + a.duration, 0);
        const gap = targetMin - totalTime;
        
        if (gap < 5) return sequence; // Too small to fill
        
        // Find short activities that haven't been used
        const usedIds = new Set(sequence.map(a => a.id));
        const fillers = pool.filter(a => 
            !usedIds.has(a.id) && 
            a.min_duration_min <= gap &&
            a.max_duration_min >= gap
        );
        
        if (fillers.length > 0) {
            const filler = fillers[0];
            sequence.push({
                ...filler,
                duration: Math.min(gap, filler.max_duration_min),
                startTime: totalTime
            });
        }
        
        return sequence;
    }

    generateReasoning(params, sequence) {
        const { mood, targetMin, surprise } = params;
        
        const moodReasons = {
            tired: 'ya que hoy están cansados, elegí actividades relajantes',
            energetic: 'tienen energía hoy, así que armé algo más dinámico',
            calm: 'para mantener ese estado tranquilo que buscan',
            fun: 'porque hoy quieren reír y pasarla bien'
        };
        
        const surpriseReasons = {
            safe: 'con actividades que sé que les gustan',
            balanced: 'mezclando lo conocido con alguna variante',
            adventurous: 'con algunas sorpresas interesantes',
            wild: 'con varias cosas nuevas para explorar'
        };
        
        const moodText = moodReasons[mood] || 'según sus preferencias';
        const surpriseLevel = this.getSurpriseLevel(surprise);
        const surpriseText = surpriseReasons[surpriseLevel] || '';
        
        return `Este plan es para ${targetMin} minutos, ${moodText}, ${surpriseText}.`;
    }

    generateTitle(mood, sequence) {
        const moodTitles = {
            tired: 'Plan para descansar',
            energetic: 'Plan energético',
            calm: 'Plan tranquilo',
            fun: 'Plan para reír'
        };
        
        return moodTitles[mood] || 'Su plan de hoy';
    }

    collectAssets(sequence) {
        const assets = new Set();
        
        sequence.forEach(activity => {
            if (activity.required_assets) {
                activity.required_assets.forEach(asset => assets.add(asset));
            }
        });
        
        return Array.from(assets);
    }

    injectDynamicContent(activity, profiles, mood) {
    if (activity.id === 'act_yt_001') {
        const target = profiles.sort((a, b) => b.weight - a.weight)[0].profile;

        let possibleChannels = target.youtube_channels;
        if (mood === 'calm' || mood === 'tired') {
            possibleChannels = target.youtube_channels.filter(c =>
                c.tags.includes('learning') ||
                c.tags.includes('storytelling') ||
                c.tags.includes('entertainment')
            );
        }

        const channel = possibleChannels[
            Math.floor(Math.random() * possibleChannels.length)
        ];

        activity.title = activity.title.replace('${channel}', channel.name);
        activity.description = activity.description
            .replace('${channel}', channel.name)
            .replace('${owner}', target.display_name);
    }
    return activity;
    }

    generatePlanId() {
        return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
