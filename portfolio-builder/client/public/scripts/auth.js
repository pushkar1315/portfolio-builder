class Auth {
  constructor() {
    this.API_URL = 'http://localhost:5000/api'; // Match your Express server
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async register(username, email, password) {
    try {
      const res = await fetch(`${this.API_URL}/auth/register`, {  // Fixed endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || data.errors?.map(e => e.msg).join('\n'));
      }

      this.token = data.token;
      localStorage.setItem('token', this.token);
      await this.getUser();
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      throw err; // Throw to handle in UI
    }
  }

  async login(email, password) {
    try {
      const res = await fetch(`${this.API_URL}/auth/login`, {  // Fixed endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Invalid credentials');
      }

      this.token = data.token;
      localStorage.setItem('token', this.token);
      await this.getUser();
      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err; // Throw to handle in UI
    }
  }

  async getUser() {
    if (!this.token) return null;
    
    try {
      const res = await fetch(`${this.API_URL}/auth/me`, {  // Fixed endpoint
        headers: {
          'x-auth-token': this.token
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to fetch user');
      }

      this.user = data;
      localStorage.setItem('user', JSON.stringify(this.user));
      return this.user;
    } catch (err) {
      console.error('Get user error:', err);
      this.logout(); // Clear invalid token
      return null;
    }
  }



  
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const auth = new Auth();