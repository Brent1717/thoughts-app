const Store = require('electron-store');

class SaaSConfigService {
    constructor() {
        this.store = new Store({ name: 'saas-config' });
        this.config = this.loadConfig();
    }

    loadConfig() {
        return {
            // Application branding
            appName: this.store.get('appName', 'Thoughts'),
            appDescription: this.store.get('appDescription', 'Intelligent Desktop AI Companion'),
            companyName: this.store.get('companyName', 'Thoughts Team'),
            website: this.store.get('website', 'https://thoughts.ai'),
            supportEmail: this.store.get('supportEmail', 'support@thoughts.ai'),
            
            // SaaS mode settings
            isSaaSMode: this.store.get('isSaaSMode', true),
            allowUserApiKeys: this.store.get('allowUserApiKeys', false),
            requireSubscription: this.store.get('requireSubscription', true),
            
            // Subscription settings
            subscriptionApiUrl: this.store.get('subscriptionApiUrl', 'https://api.youraiassistant.com'),
            subscriptionApiKey: this.store.get('subscriptionApiKey', ''),
            
            // Feature flags
            features: {
                realTimeTranscription: this.store.get('features.realTimeTranscription', true),
                screenCapture: this.store.get('features.screenCapture', true),
                aiChat: this.store.get('features.aiChat', true),
                localModels: this.store.get('features.localModels', false),
                customPrompts: this.store.get('features.customPrompts', true),
                dataExport: this.store.get('features.dataExport', false),
            },
            
            // Usage limits
            limits: {
                maxTranscriptionHours: this.store.get('limits.maxTranscriptionHours', 10),
                maxChatMessages: this.store.get('limits.maxChatMessages', 1000),
                maxStorageGB: this.store.get('limits.maxStorageGB', 5),
            }
        };
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Save to store
        Object.entries(newConfig).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    this.store.set(`${key}.${subKey}`, subValue);
                });
            } else {
                this.store.set(key, value);
            }
        });
    }

    getConfig() {
        return this.config;
    }

    isSaaSMode() {
        return this.config.isSaaSMode;
    }

    allowUserApiKeys() {
        return this.config.allowUserApiKeys;
    }

    requireSubscription() {
        return this.config.requireSubscription;
    }

    getFeatureFlag(feature) {
        return this.config.features[feature] || false;
    }

    getLimit(limit) {
        return this.config.limits[limit] || 0;
    }

    async validateSubscription(userId) {
        if (!this.config.requireSubscription) {
            return { valid: true, plan: 'free' };
        }

        try {
            const response = await fetch(`${this.config.subscriptionApiUrl}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.subscriptionApiKey}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const data = await response.json();
                return { valid: true, plan: data.plan, limits: data.limits };
            } else {
                return { valid: false, error: 'Subscription validation failed' };
            }
        } catch (error) {
            console.error('[SaaSConfigService] Subscription validation error:', error);
            return { valid: false, error: 'Network error during validation' };
        }
    }

    async checkUsageLimit(userId, feature) {
        if (!this.config.requireSubscription) {
            return { allowed: true, remaining: Infinity };
        }

        try {
            const response = await fetch(`${this.config.subscriptionApiUrl}/usage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.subscriptionApiKey}`,
                },
                body: JSON.stringify({ userId, feature }),
            });

            if (response.ok) {
                const data = await response.json();
                return { allowed: data.allowed, remaining: data.remaining };
            } else {
                return { allowed: false, remaining: 0 };
            }
        } catch (error) {
            console.error('[SaaSConfigService] Usage check error:', error);
            return { allowed: false, remaining: 0 };
        }
    }
}

module.exports = new SaaSConfigService(); 