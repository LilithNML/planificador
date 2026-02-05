/**
 * Scoring Engine
 * Calculates activity scores based on profiles, context, and heuristics
 */

export const scoringEngine = {
    /**
     * Main scoring function
     * @param {Object} activity - Activity to score
     * @param {Array} profiles - Array of {profile, weight} objects
     * @param {Object} heuristics - Current heuristics
     * @param {Object} context - Context (mood, timeOfDay, surprise)
     * @returns {number} - Final score
     */
    scoreActivity(activity, profiles, heuristics, context) {
        let score = 0;
        
        // 1. Tag matching score (most important)
        const tagScore = this.calculateTagScore(activity, profiles, heuristics);
        score += tagScore * heuristics.tagMatchWeight;
        
        // 2. Intensity matching
        const intensityScore = this.calculateIntensityScore(activity, context.mood);
        score += intensityScore * heuristics.intensityMatchWeight;
        
        // 3. Mood compatibility
        const moodScore = this.calculateMoodScore(activity, context.mood);
        score += moodScore;
        
        // 4. Time of day suitability
        if (context.timeOfDay) {
            const timeScore = this.calculateTimeScore(activity, context.timeOfDay);
            score += timeScore * 0.5;
        }
        
        // 5. Variety bonus (activities with unique tags)
        const varietyScore = this.calculateVarietyScore(activity);
        score += varietyScore * heuristics.varietyBonus;
        
        // 6. Feedback-based adjustment
        const feedbackScore = this.calculateFeedbackScore(activity);
        score += feedbackScore * heuristics.feedbackWeight;
        
        return Math.max(0, score);
    },

    /**
     * Calculate score based on tag matching with profiles
     */
    calculateTagScore(activity, profiles, heuristics) {
        let totalScore = 0;
        
        profiles.forEach(({ profile, weight }) => {
            const tags = profile.inferred_tags || {};
            const likes = profile.explicit_likes || [];
            const dislikes = profile.explicit_dislikes || [];
            
            let profileScore = 0;
            
            // Check inferred tags
            activity.tags.forEach(tag => {
                if (tags[tag]) {
                    profileScore += tags[tag] * 10; // Scale up tag confidence
                }
            });
            
            // Check explicit likes (strong positive)
            const hasLike = likes.some(like => 
                activity.tags.some(tag => tag.includes(like.toLowerCase()))
            );
            if (hasLike) {
                profileScore += 15;
            }
            
            // Check explicit dislikes (strong negative)
            const hasDislike = dislikes.some(dislike => 
                activity.tags.some(tag => tag.includes(dislike.toLowerCase()))
            );
            if (hasDislike) {
                profileScore -= 20;
            }
            
            totalScore += profileScore * weight;
        });
        
        return totalScore;
    },

    /**
     * Calculate intensity matching score
     */
    calculateIntensityScore(activity, mood) {
        const moodToIntensity = {
            tired: 0,
            calm: 0,
            energetic: 2,
            fun: 1
        };
        
        const preferredIntensity = moodToIntensity[mood];
        if (preferredIntensity === undefined) return 0;
        
        const diff = Math.abs(activity.intensity - preferredIntensity);
        
        // Perfect match: +10, one off: +5, two off: 0
        if (diff === 0) return 10;
        if (diff === 1) return 5;
        return 0;
    },

    /**
     * Calculate mood compatibility score
     */
    calculateMoodScore(activity, mood) {
        const moodTags = {
            tired: ['relaxing', 'passive', 'low-energy', 'calm', 'peaceful', 'quiet'],
            energetic: ['active', 'high-energy', 'dynamic', 'exercise', 'sport', 'movement'],
            calm: ['peaceful', 'quiet', 'meditative', 'relaxing', 'gentle', 'slow'],
            fun: ['playful', 'funny', 'entertaining', 'social', 'comedy', 'game']
        };
        
        const desiredTags = moodTags[mood] || [];
        
        let matches = 0;
        activity.tags.forEach(tag => {
            if (desiredTags.some(desired => tag.includes(desired))) {
                matches++;
            }
        });
        
        return matches * 3; // +3 per matching mood tag
    },

    /**
     * Calculate time of day suitability
     */
    calculateTimeScore(activity, timeOfDay) {
        if (!activity.suitability || !activity.suitability.time_of_day) {
            return 0;
        }
        
        const suitable = activity.suitability.time_of_day;
        
        if (suitable.includes(timeOfDay)) {
            return 5;
        }
        
        return 0;
    },

    /**
     * Calculate variety score (reward unique tags)
     */
    calculateVarietyScore(activity) {
        // Simple heuristic: more unique/specific tags = higher variety
        const commonTags = ['indoor', 'outdoor', 'free', 'paid', 'couple'];
        const uniqueTags = activity.tags.filter(tag => !commonTags.includes(tag));
        
        return Math.min(uniqueTags.length, 5); // Cap at 5 points
    },

    /**
     * Calculate score based on historical feedback
     */
    calculateFeedbackScore(activity) {
        // Get feedback from localStorage
        const feedbackData = JSON.parse(localStorage.getItem('activity_feedback') || '{}');
        const activityFeedback = feedbackData[activity.id];
        
        if (!activityFeedback) return 0;
        
        const { thumbsUp = 0, thumbsDown = 0, completed = 0, skipped = 0 } = activityFeedback;
        
        // Calculate net positive feedback
        const netFeedback = (thumbsUp * 2) + (completed * 1.5) - (thumbsDown * 2) - (skipped * 1);
        
        return netFeedback;
    },

    /**
     * Get energy profile match score
     */
    calculateEnergyProfileScore(activity, profiles, currentTime) {
        // If we have energy profile data in profiles and current time
        // we can boost/penalize based on whether activity matches energy level
        
        // Simplified: assume morning = higher energy tolerance, evening = lower
        const hour = currentTime ? new Date(currentTime).getHours() : 12;
        
        const isMorning = hour >= 6 && hour < 12;
        const isEvening = hour >= 18 && hour < 23;
        
        if (isMorning && activity.intensity === 2) {
            return 3; // Boost high intensity in morning
        }
        
        if (isEvening && activity.intensity === 0) {
            return 3; // Boost low intensity in evening
        }
        
        return 0;
    }
};

/**
 * Helper function to calculate similarity between two tag sets
 */
function calculateTagSimilarity(tags1, tags2) {
    const set1 = new Set(tags1);
    const set2 = new Set(tags2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 0;
    
    return intersection.size / union.size;
}

export { calculateTagSimilarity };
