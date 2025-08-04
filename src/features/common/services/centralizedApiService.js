const Store = require('electron-store');
const encryptionService = require('./encryptionService');

class CentralizedApiService {
    constructor() {
        this.store = new Store({ name: 'centralized-api-keys' });
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Initialize encryption for centralized keys
            await encryptionService.initializeKey('centralized_service');
        } catch (error) {
            console.warn('[CentralizedApiService] Encryption initialization failed, using fallback:', error.message);
            // For local development, we might not have encryption set up yet
        }
        
        this.isInitialized = true;
    }

    async getApiKey(provider) {
        await this.initialize();
        
        const encryptedKey = this.store.get(`providers.${provider}`);
        if (!encryptedKey) {
            throw new Error(`No API key configured for provider: ${provider}`);
        }
        
        try {
            return await encryptionService.decrypt(encryptedKey);
        } catch (error) {
            console.warn('[CentralizedApiService] Decryption failed, trying fallback:', error.message);
            // For local development, try simple decryption
            const crypto = require('crypto');
            const key = 'your-local-encryption-key-change-this-in-production';
            const decipher = crypto.createDecipher('aes-256-cbc', key);
            let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    }

    async setApiKey(provider, apiKey) {
        await this.initialize();
        
        const encryptedKey = await encryptionService.encrypt(apiKey);
        this.store.set(`providers.${provider}`, encryptedKey);
    }

    async hasApiKey(provider) {
        await this.initialize();
        return this.store.has(`providers.${provider}`);
    }

    async getAllConfiguredProviders() {
        await this.initialize();
        
        const providers = this.store.get('providers', {});
        return Object.keys(providers);
    }

    async validateApiKey(provider, apiKey) {
        // This will be called by the model state service to validate keys
        const { getProviderClass } = require('../ai/factory');
        const ProviderClass = getProviderClass(provider);
        
        if (ProviderClass && typeof ProviderClass.validateApiKey === 'function') {
            return await ProviderClass.validateApiKey(apiKey);
        }
        
        return { success: true }; // Default to success if no validation method
    }
}

module.exports = new CentralizedApiService(); 