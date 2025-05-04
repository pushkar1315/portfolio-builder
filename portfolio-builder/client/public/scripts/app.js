const API_URL = 'http://localhost:5000/api'; // Match your Express port

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    if (auth.isAuthenticated()) {
      showDashboard();
    } else {
      showAuthForms();
    }
  });

  
  app.use(express.static(path.join(__dirname, '../client')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });


  async function registerUser() {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        // Show validation errors from backend
        alert(data.msg || data.errors.map(e => e.msg).join('\n'));
        return;
      }
  
      // Save token and redirect on success
      localStorage.setItem('token', data.token);
      window.location.href = '/portfolio.html';
    } catch (err) {
      console.error('Registration error:', err);
      alert('Network error. Please try again.');
    }
  }
  async function getPortfolio() {
    const token = localStorage.getItem('token'); // Saved during login
    const response = await fetch('/api/portfolio', {
      headers: { 'x-auth-token': token }
    });
    const portfolio = await response.json();
    console.log('Portfolio data:', portfolio);
  }

  function showAuthForms() {
    document.getElementById('app').innerHTML = `
      <div class="auth-container">
        <div class="auth-form" id="login-form">
          <h2>Login</h2>
          <form id="login">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" required>
            </div>
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
        </div>
        
        <div class="auth-form" id="register-form" style="display: none;">
          <h2>Register</h2>
          <form id="register">
            <div class="form-group">
              <label for="register-username">Username</label>
              <input type="text" id="register-username" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" required minlength="6">
            </div>
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <a href="#" id="show-login">Login</a></p>
        </div>
      </div>
    `;
  
    // Add event listeners
    document.getElementById('show-register').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
    });
  
    document.getElementById('show-login').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    });
  
    document.getElementById('login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      const success = await auth.login(email, password);
      if (success) {
        showDashboard();
      } else {
        alert('Login failed. Please check your credentials.');
      }
    });
  
    document.getElementById('register').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: document.getElementById('register-username').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Registration failed');
        
        localStorage.setItem('token', data.token);
        showDashboard();
      } catch (err) {
        alert(err.message);
      }
    });
      
     
  }
  
  function showDashboard() {
    document.getElementById('app').innerHTML = `
      <header>
        <h1>Portfolio Builder</h1>
        <button id="logout">Logout</button>
      </header>
      <main>
        <div class="portfolio-editor">
          <form id="portfolio-form">
            <h2>Your Portfolio</h2>
            
            <div class="form-section">
              <h3>Basic Information</h3>
              <div class="form-group">
                <label for="portfolio-name">Your Name</label>
                <input type="text" id="portfolio-name" required>
              </div>
              <div class="form-group">
                <label for="portfolio-title">Professional Title</label>
                <input type="text" id="portfolio-title" required>
              </div>
              <div class="form-group">
                <label for="portfolio-bio">Bio</label>
                <textarea id="portfolio-bio" rows="4" required></textarea>
              </div>
            </div>
            
            <div class="form-section">
              <h3>Skills</h3>
              <div id="skills-container">
                <!-- Skills will be added here -->
              </div>
              <button type="button" id="add-skill">Add Skill</button>
            </div>
            
            <div class="form-section">
              <h3>Projects</h3>
              <div id="projects-container">
                <!-- Projects will be added here -->
              </div>
              <button type="button" id="add-project">Add Project</button>
            </div>
            
            <div class="form-section">
              <h3>Contact Information</h3>
              <div class="form-group">
                <label for="contact-email">Email</label>
                <input type="email" id="contact-email">
              </div>
              <div class="form-group">
                <label for="contact-phone">Phone</label>
                <input type="tel" id="contact-phone">
              </div>
              <div class="form-group">
                <label for="contact-github">GitHub</label>
                <input type="url" id="contact-github">
              </div>
              <div class="form-group">
                <label for="contact-linkedin">LinkedIn</label>
                <input type="url" id="contact-linkedin">
              </div>
              <div class="form-group">
                <label for="contact-twitter">Twitter</label>
                <input type="url" id="contact-twitter">
              </div>
            </div>
            
            <div class="form-section">
              <h3>Theme</h3>
              <select id="portfolio-theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
            
            <button type="submit">Save Portfolio</button>
          </form>
          
          <div class="portfolio-preview">
            <h2>Preview</h2>
            <div id="preview-container">
              <!-- Portfolio preview will be rendered here -->
            </div>
            <button id="publish-btn">Publish Portfolio</button>
          </div>
        </div>
      </main>
    `;
  
    // Add event listeners
    document.getElementById('logout').addEventListener('click', () => {
      auth.logout();
      showAuthForms();
    });
  
    // Load portfolio data
    loadPortfolioData();
    
    // Setup form functionality
    setupPortfolioForm();
  }
  
  async function loadPortfolioData() {
    const portfolioData = await portfolio.getPortfolio();
    if (portfolioData) {
      // Populate form fields
      document.getElementById('portfolio-name').value = portfolioData.name || '';
      document.getElementById('portfolio-title').value = portfolioData.title || '';
      document.getElementById('portfolio-bio').value = portfolioData.bio || '';
      
      // Populate skills
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        portfolioData.skills.forEach(skill => {
          addSkillField(skill.name, skill.level);
        });
      }
      
      // Populate projects
      if (portfolioData.projects && portfolioData.projects.length > 0) {
        portfolioData.projects.forEach(project => {
          addProjectField(project.title, project.description, project.link);
        });
      }
      
      // Populate contact
      if (portfolioData.contact) {
        document.getElementById('contact-email').value = portfolioData.contact.email || '';
        document.getElementById('contact-phone').value = portfolioData.contact.phone || '';
        if (portfolioData.contact.social) {
          document.getElementById('contact-github').value = portfolioData.contact.social.github || '';
          document.getElementById('contact-linkedin').value = portfolioData.contact.social.linkedin || '';
          document.getElementById('contact-twitter').value = portfolioData.contact.social.twitter || '';
        }
      }
      
      // Populate theme
      document.getElementById('portfolio-theme').value = portfolioData.theme || 'light';
      
      // Update preview
      updatePreview(portfolioData);
    }
  }
  
  function setupPortfolioForm() {
    // Add skill
    document.getElementById('add-skill').addEventListener('click', () => {
      addSkillField();
    });
    
    // Add project
    document.getElementById('add-project').addEventListener('click', () => {
      addProjectField();
    });
    
    // Form submission
    document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Gather form data
      const portfolioData = {
        name: document.getElementById('portfolio-name').value,
        title: document.getElementById('portfolio-title').value,
        bio: document.getElementById('portfolio-bio').value,
        skills: [],
        projects: [],
        contact: {
          email: document.getElementById('contact-email').value,
          phone: document.getElementById('contact-phone').value,
          social: {
            github: document.getElementById('contact-github').value,
            linkedin: document.getElementById('contact-linkedin').value,
            twitter: document.getElementById('contact-twitter').value
          }
        },
        theme: document.getElementById('portfolio-theme').value
      };
      
      // Get skills
      const skillElements = document.querySelectorAll('.skill-item');
      skillElements.forEach(skillEl => {
        const name = skillEl.querySelector('.skill-name').value;
        const level = skillEl.querySelector('.skill-level').value;
        if (name) {
          portfolioData.skills.push({ name, level: parseInt(level) });
        }
      });
      
      // Get projects
      const projectElements = document.querySelectorAll('.project-item');
      projectElements.forEach(projectEl => {
        const title = projectEl.querySelector('.project-title').value;
        const description = projectEl.querySelector('.project-description').value;
        const link = projectEl.querySelector('.project-link').value;
        if (title) {
          portfolioData.projects.push({ title, description, link });
        }
      });
      
      // Save portfolio
      const savedPortfolio = await portfolio.savePortfolio(portfolioData);
      if (savedPortfolio) {
        updatePreview(savedPortfolio);
        alert('Portfolio saved successfully!');
      } else {
        alert('Failed to save portfolio. Please try again.');
      }
    });
    
    // Publish button
    document.getElementById('publish-btn').addEventListener('click', () => {
      alert('Your portfolio is now live!');
      // In a real app, you would implement actual publishing logic here
    });
    
    // Theme change
    document.getElementById('portfolio-theme').addEventListener('change', () => {
      const theme = document.getElementById('portfolio-theme').value;
      updatePreview({ theme });
    });
  }
  
  function addSkillField(name = '', level = 50) {
    const skillsContainer = document.getElementById('skills-container');
    const skillId = Date.now();
    
    const skillElement = document.createElement('div');
    skillElement.className = 'skill-item';
    skillElement.innerHTML = `
      <div class="form-group">
        <label>Skill Name</label>
        <input type="text" class="skill-name" value="${name}" placeholder="e.g., JavaScript">
      </div>
      <div class="form-group">
        <label>Skill Level (0-100)</label>
        <input type="range" class="skill-level" min="0" max="100" value="${level}">
        <span class="skill-level-value">${level}%</span>
      </div>
      <button type="button" class="remove-skill">Remove</button>
    `;
    
    skillsContainer.appendChild(skillElement);
    
    // Add event listeners
    skillElement.querySelector('.skill-level').addEventListener('input', (e) => {
      skillElement.querySelector('.skill-level-value').textContent = `${e.target.value}%`;
    });
    
    skillElement.querySelector('.remove-skill').addEventListener('click', () => {
      skillsContainer.removeChild(skillElement);
    });
  }
  
  function addProjectField(title = '', description = '', link = '') {
    const projectsContainer = document.getElementById('projects-container');
    const projectId = Date.now();
    
    const projectElement = document.createElement('div');
    projectElement.className = 'project-item';
    projectElement.innerHTML = `
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="project-title" value="${title}" placeholder="e.g., E-commerce Website">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="project-description" rows="3" placeholder="Describe your project...">${description}</textarea>
      </div>
      <div class="form-group">
        <label>Link (URL)</label>
        <input type="url" class="project-link" value="${link}" placeholder="https://example.com">
      </div>
      <button type="button" class="remove-project">Remove</button>
    `;
    
    projectsContainer.appendChild(projectElement);
    
    // Add event listener for remove button
    projectElement.querySelector('.remove-project').addEventListener('click', () => {
      projectsContainer.removeChild(projectElement);
    });
  }
  
  function updatePreview(portfolioData) {
    const previewContainer = document.getElementById('preview-container');
    
    // Apply theme
    previewContainer.className = '';
    previewContainer.classList.add(`theme-${portfolioData.theme || 'light'}`);
    
    // Generate HTML for preview
    previewContainer.innerHTML = `
      <div class="portfolio-header">
        <h1>${portfolioData.name || 'Your Name'}</h1>
        <h2>${portfolioData.title || 'Professional Title'}</h2>
      </div>
      
      <div class="portfolio-section">
        <h3>About Me</h3>
        <p>${portfolioData.bio || 'Write something about yourself here.'}</p>
      </div>
      
      ${portfolioData.skills && portfolioData.skills.length > 0 ? `
      <div class="portfolio-section">
        <h3>Skills</h3>
        <div class="skills-list">
          ${portfolioData.skills.map(skill => `
            <div class="skill">
              <span class="skill-name">${skill.name}</span>
              <div class="skill-bar">
                <div class="skill-level" style="width: ${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${portfolioData.projects && portfolioData.projects.length > 0 ? `
      <div class="portfolio-section">
        <h3>Projects</h3>
        <div class="projects-grid">
          ${portfolioData.projects.map(project => `
            <div class="project-card">
              <h4>${project.title}</h4>
              <p>${project.description}</p>
              ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${portfolioData.contact ? `
      <div class="portfolio-section">
        <h3>Contact</h3>
        <div class="contact-info">
          ${portfolioData.contact.email ? `<p><strong>Email:</strong> ${portfolioData.contact.email}</p>` : ''}
          ${portfolioData.contact.phone ? `<p><strong>Phone:</strong> ${portfolioData.contact.phone}</p>` : ''}
          <div class="social-links">
            ${portfolioData.contact.social && portfolioData.contact.social.github ? `
              <a href="${portfolioData.contact.social.github}" target="_blank">GitHub</a>
            ` : ''}
            ${portfolioData.contact.social && portfolioData.contact.social.linkedin ? `
              <a href="${portfolioData.contact.social.linkedin}" target="_blank">LinkedIn</a>
            ` : ''}
            ${portfolioData.contact.social && portfolioData.contact.social.twitter ? `
              <a href="${portfolioData.contact.social.twitter}" target="_blank">Twitter</a>
            ` : ''}
          </div>
        </div>
      </div>
      ` : ''}
    `;
  }