import { html, css, LitElement } from '../assets/lit-core-2.7.4.min.js';

export class SubscriptionView extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            color: var(--text-color);
            background: transparent;
            padding: 20px;
            box-sizing: border-box;
        }

        .subscription-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
        }

        .header p {
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }

        .plan-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .plan-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .plan-name {
            font-size: 18px;
            font-weight: 600;
        }

        .plan-price {
            font-size: 24px;
            font-weight: 700;
            color: #4ade80;
        }

        .plan-features {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .plan-features li {
            padding: 8px 0;
            display: flex;
            align-items: center;
        }

        .plan-features li::before {
            content: "✓";
            color: #4ade80;
            font-weight: bold;
            margin-right: 10px;
        }

        .usage-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .usage-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }

        .usage-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 5px;
        }

        .usage-value {
            font-size: 18px;
            font-weight: 600;
        }

        .usage-progress {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }

        .usage-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4ade80, #22c55e);
            transition: width 0.3s ease;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            flex: 1;
        }

        .btn-primary {
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .status-indicator {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .status-active {
            background: rgba(74, 222, 128, 0.2);
            color: #4ade80;
        }

        .status-expired {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: rgba(255, 255, 255, 0.6);
        }
    `;

    static properties = {
        subscriptionData: { type: Object },
        usageData: { type: Object },
        isLoading: { type: Boolean },
        error: { type: String }
    };

    constructor() {
        super();
        this.subscriptionData = null;
        this.usageData = null;
        this.isLoading = true;
        this.error = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadSubscriptionData();
    }

    async loadSubscriptionData() {
        try {
            this.isLoading = true;
            
            // Load subscription and usage data
            const [subscription, usage] = await Promise.all([
                this.getSubscriptionInfo(),
                this.getUsageInfo()
            ]);
            
            this.subscriptionData = subscription;
            this.usageData = usage;
        } catch (error) {
            console.error('[SubscriptionView] Error loading data:', error);
            this.error = 'Failed to load subscription data';
        } finally {
            this.isLoading = false;
        }
    }

    async getSubscriptionInfo() {
        // This would call your SaaS backend
        if (window.api && window.api.subscription) {
            return await window.api.subscription.getInfo();
        }
        
        // Mock data for development
        return {
            plan: 'pro',
            status: 'active',
            nextBilling: '2024-02-01',
            features: ['Real-time transcription', 'AI chat', 'Screen capture', 'Custom prompts']
        };
    }

    async getUsageInfo() {
        // This would call your SaaS backend
        if (window.api && window.api.subscription) {
            return await window.api.subscription.getUsage();
        }
        
        // Mock data for development
        return {
            transcription: { used: 2.5, limit: 10, unit: 'hours' },
            chat: { used: 150, limit: 1000, unit: 'messages' },
            storage: { used: 1.2, limit: 5, unit: 'GB' }
        };
    }

    calculateProgress(used, limit) {
        return Math.min((used / limit) * 100, 100);
    }

    async handleUpgrade() {
        if (window.api && window.api.subscription) {
            await window.api.subscription.openUpgradePage();
        } else {
                    // Open upgrade URL
        window.open('https://thoughts.ai/upgrade', '_blank');
        }
    }

    async handleManage() {
        if (window.api && window.api.subscription) {
            await window.api.subscription.openManagePage();
        } else {
                    // Open management URL
        window.open('https://thoughts.ai/account', '_blank');
        }
    }

    render() {
        if (this.isLoading) {
            return html`
                <div class="loading">
                    <p>Loading subscription information...</p>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="subscription-container">
                    <div class="header">
                        <h2>Subscription Error</h2>
                        <p>${this.error}</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="subscription-container">
                <div class="header">
                    <h2>Subscription</h2>
                    <p>Manage your plan and usage</p>
                </div>

                <div class="plan-card">
                    <div class="plan-header">
                        <div>
                            <div class="plan-name">${this.subscriptionData?.plan?.toUpperCase() || 'FREE'} Plan</div>
                            <div class="status-indicator ${this.subscriptionData?.status === 'active' ? 'status-active' : 'status-expired'}">
                                ${this.subscriptionData?.status || 'unknown'}
                            </div>
                        </div>
                        <div class="plan-price">
                            ${this.subscriptionData?.plan === 'pro' ? '$19' : '$0'}/month
                        </div>
                    </div>
                    
                    <ul class="plan-features">
                        ${(this.subscriptionData?.features || []).map(feature => html`
                            <li>${feature}</li>
                        `)}
                    </ul>
                </div>

                <div class="usage-stats">
                    ${Object.entries(this.usageData || {}).map(([key, data]) => html`
                        <div class="usage-item">
                            <div class="usage-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            <div class="usage-value">${data.used} / ${data.limit} ${data.unit}</div>
                            <div class="usage-progress">
                                <div class="usage-progress-bar" style="width: ${this.calculateProgress(data.used, data.limit)}%"></div>
                            </div>
                        </div>
                    `)}
                </div>

                <div class="action-buttons">
                    <button class="btn btn-secondary" @click=${this.handleManage}>
                        Manage Account
                    </button>
                    ${this.subscriptionData?.plan !== 'pro' ? html`
                        <button class="btn btn-primary" @click=${this.handleUpgrade}>
                            Upgrade to Pro
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('subscription-view', SubscriptionView); 