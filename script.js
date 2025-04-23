class CryptoTracker {
    constructor() {
        this.apiUrl = 'https://api.coingecko.com/api/v3';
        this.portfolio = JSON.parse(localStorage.getItem('cryptoPortfolio')) || [];
        this.init();
    }

    async init() {
        await this.loadCryptoPrices();
        this.updatePortfolioDisplay();
        this.setupEventListeners();
    }

    async loadCryptoPrices() {
        try {
            const response = await fetch(`${this.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`);
            const cryptos = await response.json();
            this.displayCryptoPrices(cryptos);
        } catch (error) {
            console.error('Failed to fetch crypto prices:', error);
            this.displayError();
        }
    }

    displayCryptoPrices(cryptos) {
        const cryptoList = document.getElementById('crypto-list');
        cryptoList.innerHTML = '';

        cryptos.forEach(crypto => {
            const cryptoCard = document.createElement('div');
            cryptoCard.className = 'crypto-card';
            cryptoCard.innerHTML = `
                <div class="crypto-info">
                    <img src="${crypto.image}" alt="${crypto.name}" width="32" height="32">
                    <div>
                        <h3>${crypto.name}</h3>
                        <span>${crypto.symbol.toUpperCase()}</span>
                    </div>
                </div>
                <div class="crypto-price">
                    <div class="price">$${crypto.current_price.toLocaleString()}</div>
                    <div class="change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            `;
            cryptoList.appendChild(cryptoCard);
        });
    }

    displayError() {
        const cryptoList = document.getElementById('crypto-list');
        cryptoList.innerHTML = '<p>Failed to load cryptocurrency data. Please try again later.</p>';
    }

    updatePortfolioDisplay() {
        const portfolioList = document.getElementById('portfolio-list');
        const totalValue = document.getElementById('total-value');

        if (this.portfolio.length === 0) {
            portfolioList.innerHTML = '<p>No holdings in your portfolio yet.</p>';
            totalValue.textContent = '0.00';
            return;
        }

        let total = 0;
        portfolioList.innerHTML = '';

        this.portfolio.forEach(holding => {
            const value = holding.amount * holding.price;
            total += value;

            const holdingElement = document.createElement('div');
            holdingElement.className = 'portfolio-item';
            holdingElement.innerHTML = `
                <div class="holding-info">
                    <h4>${holding.symbol.toUpperCase()}</h4>
                    <span>${holding.amount} coins</span>
                </div>
                <div class="holding-value">
                    $${value.toFixed(2)}
                </div>
            `;
            portfolioList.appendChild(holdingElement);
        });

        totalValue.textContent = total.toFixed(2);
    }

    setupEventListeners() {
        // Refresh prices every 30 seconds
        setInterval(() => {
            this.loadCryptoPrices();
        }, 30000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CryptoTracker();
});