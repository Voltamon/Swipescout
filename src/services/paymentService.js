import api from './api';

const PAYMENT_BASE_URL = '/payment';

// Get available plans and services
export const getPlansAndServices = async () => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/plans`);
        return response.data;
    } catch (error) {
        console.error('Error fetching plans and services:', error);
        throw error;
    }
};

// Get user's subscription status
export const getSubscriptionStatus = async (userId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/subscription/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        throw error;
    }
};

// Create subscription
export const createSubscription = async (planType, userId, isAnnual = false) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/subscription`, {
            planType,
            userId,
            isAnnual
        });
        return response.data;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};

// Purchase one-time service
export const purchaseService = async (serviceType, userId) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/service`, {
            serviceType,
            userId
        });
        return response.data;
    } catch (error) {
        console.error('Error purchasing service:', error);
        throw error;
    }
};

// Cancel subscription
export const cancelSubscription = async (userId) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/subscription/cancel`, {
            userId
        });
        return response.data;
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
};

// Get user's service purchases
export const getServicePurchases = async (userId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/services/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching service purchases:', error);
        throw error;
    }
};

// Check if user has access to a feature
export const checkFeatureAccess = async (userId, featureType) => {
    try {
        const subscription = await getSubscriptionStatus(userId);
        const plan = subscription.currentPlan || 'BASIC';
        
        // Define feature access based on plans
        const featureAccess = {
            BASIC: {
                video_upload: 1,
                applications: 10,
                profile_views: 50,
                ai_recommendations: 5,
                video_editing: false,
                analytics: false,
                priority_support: false,
                career_coaching: false
            },
            PROFESSIONAL: {
                video_upload: 5,
                applications: 50,
                profile_views: 500,
                ai_recommendations: 25,
                video_editing: true,
                analytics: true,
                priority_support: true,
                career_coaching: false
            },
            PREMIUM: {
                video_upload: -1, // unlimited
                applications: -1,
                profile_views: -1,
                ai_recommendations: -1,
                video_editing: true,
                analytics: true,
                priority_support: true,
                career_coaching: true
            },
            ENTERPRISE: {
                video_upload: -1,
                applications: -1,
                profile_views: -1,
                ai_recommendations: -1,
                video_editing: true,
                analytics: true,
                priority_support: true,
                career_coaching: true,
                api_access: true,
                white_label: true
            }
        };

        const planFeatures = featureAccess[plan] || featureAccess.BASIC;
        return planFeatures[featureType] || false;
    } catch (error) {
        console.error('Error checking feature access:', error);
        return false;
    }
};

// Track feature usage
export const trackFeatureUsage = async (userId, featureType) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/track-usage`, {
            userId,
            featureType
        });
        return response.data;
    } catch (error) {
        console.error('Error tracking feature usage:', error);
        throw error;
    }
};

// Get usage statistics
export const getUsageStats = async (userId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/usage-stats/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        throw error;
    }
};

// Apply promotional code
export const applyPromoCode = async (code, userId, orderType, orderId) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/apply-promo`, {
            code,
            userId,
            orderType,
            orderId
        });
        return response.data;
    } catch (error) {
        console.error('Error applying promo code:', error);
        throw error;
    }
};

// Validate promotional code
export const validatePromoCode = async (code, planType = null, serviceType = null) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/validate-promo`, {
            code,
            planType,
            serviceType
        });
        return response.data;
    } catch (error) {
        console.error('Error validating promo code:', error);
        throw error;
    }
};

// Get payment methods
export const getPaymentMethods = async (userId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/payment-methods/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }
};

// Add payment method
export const addPaymentMethod = async (userId, paymentMethodId) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/payment-methods`, {
            userId,
            paymentMethodId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding payment method:', error);
        throw error;
    }
};

// Remove payment method
export const removePaymentMethod = async (paymentMethodId) => {
    try {
        const response = await api.delete(`${PAYMENT_BASE_URL}/payment-methods/${paymentMethodId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing payment method:', error);
        throw error;
    }
};

// Set default payment method
export const setDefaultPaymentMethod = async (userId, paymentMethodId) => {
    try {
        const response = await api.post(`${PAYMENT_BASE_URL}/payment-methods/default`, {
            userId,
            paymentMethodId
        });
        return response.data;
    } catch (error) {
        console.error('Error setting default payment method:', error);
        throw error;
    }
};

// Get billing history
export const getBillingHistory = async (userId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/billing-history/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching billing history:', error);
        throw error;
    }
};

// Download invoice
export const downloadInvoice = async (invoiceId) => {
    try {
        const response = await api.get(`${PAYMENT_BASE_URL}/invoice/${invoiceId}/download`, {
            responseType: 'blob'
        });
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        return true;
    } catch (error) {
        console.error('Error downloading invoice:', error);
        throw error;
    }
};

// Feature limits and access helpers
export const FEATURE_LIMITS = {
    BASIC: {
        videoUploads: 1,
        applications: 10,
        profileViews: 50,
        aiRecommendations: 5,
        videoEditing: false,
        analytics: false,
        prioritySupport: false,
        careerCoaching: false
    },
    PROFESSIONAL: {
        videoUploads: 5,
        applications: 50,
        profileViews: 500,
        aiRecommendations: 25,
        videoEditing: true,
        analytics: true,
        prioritySupport: true,
        careerCoaching: false
    },
    PREMIUM: {
        videoUploads: -1, // unlimited
        applications: -1,
        profileViews: -1,
        aiRecommendations: -1,
        videoEditing: true,
        analytics: true,
        prioritySupport: true,
        careerCoaching: true
    },
    ENTERPRISE: {
        videoUploads: -1,
        applications: -1,
        profileViews: -1,
        aiRecommendations: -1,
        videoEditing: true,
        analytics: true,
        prioritySupport: true,
        careerCoaching: true,
        apiAccess: true,
        whiteLabel: true
    }
};

// Check if feature is available for plan
export const isFeatureAvailable = (plan, feature) => {
    const planLimits = FEATURE_LIMITS[plan] || FEATURE_LIMITS.BASIC;
    return planLimits[feature] === true || planLimits[feature] === -1 || (typeof planLimits[feature] === 'number' && planLimits[feature] > 0);
};

// Get feature limit for plan
export const getFeatureLimit = (plan, feature) => {
    const planLimits = FEATURE_LIMITS[plan] || FEATURE_LIMITS.BASIC;
    return planLimits[feature] || 0;
};

// Check if user has reached feature limit
export const hasReachedLimit = (plan, feature, currentUsage) => {
    const limit = getFeatureLimit(plan, feature);
    if (limit === -1) return false; // unlimited
    if (limit === false || limit === 0) return true; // not available
    return currentUsage >= limit;
};

// Get upgrade suggestions
export const getUpgradeSuggestions = (currentPlan, requestedFeature) => {
    const suggestions = [];
    
    if (currentPlan === 'BASIC') {
        if (['videoEditing', 'analytics', 'prioritySupport'].includes(requestedFeature)) {
            suggestions.push('PROFESSIONAL');
        }
        if (['careerCoaching'].includes(requestedFeature)) {
            suggestions.push('PREMIUM');
        }
        if (['apiAccess', 'whiteLabel'].includes(requestedFeature)) {
            suggestions.push('ENTERPRISE');
        }
    } else if (currentPlan === 'PROFESSIONAL') {
        if (['careerCoaching'].includes(requestedFeature)) {
            suggestions.push('PREMIUM');
        }
        if (['apiAccess', 'whiteLabel'].includes(requestedFeature)) {
            suggestions.push('ENTERPRISE');
        }
    } else if (currentPlan === 'PREMIUM') {
        if (['apiAccess', 'whiteLabel'].includes(requestedFeature)) {
            suggestions.push('ENTERPRISE');
        }
    }
    
    return suggestions;
};

export default {
    getPlansAndServices,
    getSubscriptionStatus,
    createSubscription,
    purchaseService,
    cancelSubscription,
    getServicePurchases,
    checkFeatureAccess,
    trackFeatureUsage,
    getUsageStats,
    applyPromoCode,
    validatePromoCode,
    getPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getBillingHistory,
    downloadInvoice,
    isFeatureAvailable,
    getFeatureLimit,
    hasReachedLimit,
    getUpgradeSuggestions
};

