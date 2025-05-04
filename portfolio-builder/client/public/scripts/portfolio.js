class Portfolio {
    constructor() {
      this.auth = auth;
    }
  
    async getPortfolio() {
      try {
        const res = await fetch('/api/portfolio', {
          method: 'GET',
          headers: {
            'x-auth-token': this.auth.token
          }
        });
  
        const data = await res.json();
        
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.msg || 'Failed to get portfolio');
        }
      } catch (err) {
        console.error('Get portfolio error:', err);
        return null;
      }
    }
  
    async savePortfolio(portfolioData) {
      try {
        const response = await fetch(`${API_URL}/portfolio`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': this.auth.token
          },
          body: JSON.stringify(portfolioData)
        });
  
        const data = await res.json();
        
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.msg || 'Failed to save portfolio');
        }
      } catch (err) {
        console.error('Save portfolio error:', err);
        return null;
      }
    }
  }
  
  const portfolio = new Portfolio();