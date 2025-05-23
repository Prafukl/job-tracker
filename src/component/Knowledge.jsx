import React, { useState, useEffect } from 'react';

const KnowledgeTools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced tool database with descriptions
  const toolDatabase = {
    'Resume Builders': [
      { 
        name: 'Overleaf', 
        url: 'https://www.overleaf.com/', 
        icon: '📝',
        description: 'LaTeX editor for professional documents'
      },
      { 
        name: 'Canva', 
        url: 'https://www.canva.com/resumes/', 
        icon: '🎨',
        description: 'Design beautiful resumes with templates'
      },
      { 
        name: 'Resume.io', 
        url: 'https://resume.io/', 
        icon: '🔧',
        description: 'Build professional resumes quickly'
      },
      { 
        name: 'NovoResume', 
        url: 'https://novoresume.com/', 
        icon: '💼',
        description: 'Modern resume builder with ATS optimization'
      }
    ],
    'Job Sites': [
      { 
        name: 'LinkedIn', 
        url: 'https://www.linkedin.com/jobs/', 
        icon: '👔',
        description: 'Professional networking and job search'
      },
      { 
        name: 'Indeed', 
        url: 'https://www.indeed.com/', 
        icon: '🔍',
        description: 'World\'s largest job search engine'
      },
      { 
        name: 'Glassdoor', 
        url: 'https://www.glassdoor.com/', 
        icon: '🏢',
        description: 'Jobs with company reviews and salaries'
      },
      { 
        name: 'AngelList', 
        url: 'https://angel.co/', 
        icon: '🚀',
        description: 'Startup jobs and investments'
      }
    ],
    'IDEs & Dev Tools': [
      { 
        name: 'VS Code', 
        url: 'https://code.visualstudio.com/', 
        icon: '🔷',
        description: 'Free code editor with extensions'
      },
      { 
        name: 'IntelliJ IDEA', 
        url: 'https://www.jetbrains.com/idea/', 
        icon: '🧩',
        description: 'Powerful IDE for Java development'
      },
      { 
        name: 'GitHub', 
        url: 'https://github.com/', 
        icon: '🐙',
        description: 'Code hosting and version control'
      },
      { 
        name: 'CodeSandbox', 
        url: 'https://codesandbox.io/', 
        icon: '📦',
        description: 'Online code editor and playground'
      }
    ],
    'Learning Resources': [
      { 
        name: 'Coursera', 
        url: 'https://www.coursera.org/', 
        icon: '🎓',
        description: 'University courses and certifications'
      },
      { 
        name: 'Udemy', 
        url: 'https://www.udemy.com/', 
        icon: '📖',
        description: 'Practical courses for skill development'
      },
      { 
        name: 'freeCodeCamp', 
        url: 'https://www.freecodecamp.org/', 
        icon: '⚡',
        description: 'Free coding bootcamp curriculum'
      },
      { 
        name: 'LeetCode', 
        url: 'https://www.leetcode.com/', 
        icon: '🧮',
        description: 'Coding challenges and interview prep'
      }
    ],
    'Interview Prep': [
      { 
        name: 'Pramp', 
        url: 'https://www.pramp.com/', 
        icon: '🗣️',
        description: 'Free mock interviews with peers'
      },
      { 
        name: 'Interviewing.io', 
        url: 'https://interviewing.io/', 
        icon: '📞',
        description: 'Anonymous technical interviews'
      },
      { 
        name: 'HackerRank', 
        url: 'https://www.hackerrank.com/', 
        icon: '💡',
        description: 'Coding challenges and assessments'
      },
      { 
        name: 'Interview Cake', 
        url: 'https://www.interviewcake.com/', 
        icon: '🍰',
        description: 'Programming interview questions'
      }
    ],
    'Productivity Tools': [
      { 
        name: 'Notion', 
        url: 'https://www.notion.so/', 
        icon: '📝',
        description: 'All-in-one workspace for notes and tasks'
      },
      { 
        name: 'Trello', 
        url: 'https://trello.com/', 
        icon: '📋',
        description: 'Visual project management boards'
      },
      { 
        name: 'Todoist', 
        url: 'https://todoist.com/', 
        icon: '✅',
        description: 'Task management and productivity'
      },
      { 
        name: 'Grammarly', 
        url: 'https://www.grammarly.com/', 
        icon: '✏️',
        description: 'Writing assistant and grammar checker'
      }
    ]
  };

  // Filter categories based on active filter
  const filteredCategories = Object.entries(toolDatabase).filter(([categoryName]) => {
    return activeFilter === 'All' || categoryName === activeFilter;
  });

  // Track tool clicks
  const handleToolClick = (toolName) => {
    console.log('Tool clicked:', toolName);
  };

  // Get total tools count
  const totalTools = Object.values(toolDatabase).reduce((sum, tools) => sum + tools.length, 0);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Knowledge Tools...</p>
      </div>
    );
  }

  return (
    <div className="knowledge-tools-app">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-icon">🚀</span>
            Knowledge Tools Hub
          </h1>
          <p className="subtitle">
            Discover powerful tools to accelerate your learning and career growth
          </p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{totalTools}</span>
              <span className="stat-label">Tools Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(toolDatabase).length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container">
        {/* Search and Filter Section */}
        <div className="controls-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search tools by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="filter-container">
            <h3 className="filter-title">Filter by Category:</h3>
            <div className="filter-buttons">
              {['All', ...Object.keys(toolDatabase)].map((filterName) => (
                <button
                  key={filterName}
                  className={`filter-button ${activeFilter === filterName ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filterName)}
                >
                  {filterName === 'All' ? '🌟' : 
                   filterName === 'Resume Builders' ? '📄' :
                   filterName === 'Job Sites' ? '💼' :
                   filterName === 'IDEs & Dev Tools' ? '💻' :
                   filterName === 'Learning Resources' ? '📚' :
                   filterName === 'Interview Prep' ? '🎯' : '⚡'}
                  {filterName}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Featured Video Section */}
        <section className="video-section">
          <h2 className="section-title">
            <span className="section-icon">🎥</span>
            Featured Learning Content
          </h2>
          <div className="video-container">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/31EWjB_9Jig?si=CLLsduZtIEC4v04P" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </section>
        
        {/* Tool Categories */}
        <section className="tools-section">
          <h2 className="section-title">
            <span className="section-icon">🛠️</span>
            Explore Tools by Category
          </h2>
          
          <div className="tool-categories">
            {filteredCategories.map(([categoryName, tools]) => {
              const filteredTools = tools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm)
              );
              
              if (filteredTools.length === 0) return null;
              
              return (
                <div key={categoryName} className="category-card">
                  <div className="category-header">
                    <h3 className="category-title">
                      <span className="category-icon">
                        {categoryName === 'Resume Builders' && '📄'}
                        {categoryName === 'Job Sites' && '💼'}
                        {categoryName === 'IDEs & Dev Tools' && '💻'}
                        {categoryName === 'Learning Resources' && '📚'}
                        {categoryName === 'Interview Prep' && '🎯'}
                        {categoryName === 'Productivity Tools' && '⚡'}
                      </span>
                      {categoryName}
                    </h3>
                    <span className="tool-count">{filteredTools.length} tools</span>
                  </div>
                  
                  <div className="tool-grid">
                    {filteredTools.map((tool) => (
                      <div key={tool.name} className="tool-card">
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tool-link"
                          onClick={() => handleToolClick(tool.name)}
                        >
                          <div className="tool-icon">{tool.icon}</div>
                          <div className="tool-info">
                            <h4 className="tool-name">{tool.name}</h4>
                            <p className="tool-description">{tool.description}</p>
                          </div>
                          <div className="tool-arrow">→</div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer">
          <p>💡 Tip: Bookmark this page to quickly access all your favorite tools!</p>
        </footer>
      </div>
      
      <style jsx>{`
      /* Knowledge Tools CSS */
/* Choose one of these background color combinations by uncommenting it */

/* Option 1: Deep Purple/Blue Gradient (Original) */
/*
:root {
  --bg-gradient-start: #667eea;
  --bg-gradient-end: #764ba2;
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ffd700;
}
*/

/* Option 2: Teal/Blue Gradient */
:root {
  --bg-gradient-start: #4facfe;
  --bg-gradient-end: #00f2fe;
  --primary-color: #4facfe;
  --secondary-color: #00f2fe;
  --accent-color: #ff9a9e;
}

/* Option 3: Coral/Peach Gradient */
/*
:root {
  --bg-gradient-start: #ff758c;
  --bg-gradient-end: #ff7eb3;
  --primary-color: #ff758c;
  --secondary-color: #ff7eb3;
  --accent-color: #7afcff;
}
*/

/* Option 4: Sunset Gradient */
/*
:root {
  --bg-gradient-start: #ff7e5f;
  --bg-gradient-end: #feb47b;
  --primary-color: #ff7e5f;
  --secondary-color: #feb47b;
  --accent-color: #6a3093;
}
*/

/* Option 5: Ocean Gradient */
/*
:root {
  --bg-gradient-start: #43cea2;
  --bg-gradient-end: #185a9d;
  --primary-color: #43cea2;
  --secondary-color: #185a9d;
  --accent-color: #f9d423;
}
*/

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.knowledge-tools-app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ;
  min-height: 100vh;
  color: #333;
  line-height: 1.6;
}

/* Loading Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Header Styles */
.header-section {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 60px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #000;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.title-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.subtitle {
  font-size: 1.3rem;
  color: rgba(109, 19, 19, 0.9);
  margin-bottom: 30px;
  font-weight: 300;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-color);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Controls Section */
.controls-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.search-container {
  margin-bottom: 30px;
}

.search-input-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 50px;
  border: 2px solid #e0e7ff;
  border-radius: 50px;
  font-size: 16px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #6b7280;
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.filter-title {
  text-align: center;
  margin-bottom: 20px;
  color: #374151;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.filter-button.active {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-color: transparent;
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 30px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.section-icon {
  font-size: 2.5rem;
}

/* Video Section */
.video-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.video-section .section-title {
  color: #374151;
  text-shadow: none;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 15px;
  background: #000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Tools Section */
.tools-section {
  margin-bottom: 50px;
}

.tool-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f5f9;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
}

.category-icon {
  font-size: 1.5rem;
}

.tool-count {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tool-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tool-card {
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tool-card:hover {
  border-color: var(--primary-color);
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(102,126,234,0.2);
}

.tool-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  text-decoration: none;
  color: inherit;
}

.tool-icon {
  font-size: 2rem;
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 10px;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
}

.tool-description {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.tool-arrow {
  font-size: 1.2rem;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-arrow {
  color: var(--primary-color);
  transform: translateX(5px);
}

/* Footer */
.footer {
  text-align: center;
  padding: 30px;
  color: rgba(20, 18, 18, 0.8);
  font-size: 1.1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 10px;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .stats-bar {
    gap: 20px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .tool-categories {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 1.2rem;
  }

  .filter-buttons {
    gap: 8px;
  }

  .filter-button {
    padding: 8px 15px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 40px 15px;
  }

  .container {
    padding: 20px 15px;
  }

  .main-title {
    font-size: 2rem;
  }

  .controls-section,
  .video-section,
  .category-card {
    padding: 20px;
  }

  .search-input {
    padding: 12px 40px 12px 40px;
  }

  .tool-categories {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .tool-link {
    padding: 12px;
  }

  .tool-icon {
    min-width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}
      `}</style>
    </div>
  );
};

export default KnowledgeTools;