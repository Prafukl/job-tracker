import React, { useState, useEffect } from 'react';

const KnowledgeTools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Tool database
  const toolDatabase = {
    'Resume Builders': [
      { name: 'Overleaf', url: 'https://www.overleaf.com/', icon: '📝' },
      { name: 'Canva', url: 'https://www.canva.com/resumes/', icon: '🎨' },
      { name: 'Resume.io', url: 'https://resume.io/', icon: '🔧' },
      { name: 'NovoResume', url: 'https://novoresume.com/', icon: '💼' }
    ],
    'Job Sites': [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/', icon: '👔' },
      { name: 'Indeed', url: 'https://www.indeed.com/', icon: '🔍' },
      { name: 'Glassdoor', url: 'https://www.glassdoor.com/', icon: '🏢' },
      { name: 'AngelList', url: 'https://angel.co/', icon: '🚀' }
    ],
    'IDEs & Dev Tools': [
      { name: 'VS Code', url: 'https://code.visualstudio.com/', icon: '🔷' },
      { name: 'IntelliJ IDEA', url: 'https://www.jetbrains.com/idea/', icon: '🧩' },
      { name: 'GitHub', url: 'https://github.com/', icon: '🐙' },
      { name: 'CodeSandbox', url: 'https://codesandbox.io/', icon: '📦' }
    ],
    'Learning Resources': [
      { name: 'Coursera', url: 'https://www.coursera.org/', icon: '🎓' },
      { name: 'Udemy', url: 'https://www.udemy.com/', icon: '📖' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', icon: '⚡' },
      { name: 'LeetCode', url: 'https://www.leetcode.com/', icon: '🧮' }
    ],
    'Interview Prep': [
      { name: 'Pramp', url: 'https://www.pramp.com/', icon: '🗣️' },
      { name: 'Interviewing.io', url: 'https://interviewing.io/', icon: '📞' },
      { name: 'HackerRank', url: 'https://www.hackerrank.com/', icon: '💡' },
      { name: 'Interview Cake', url: 'https://www.interviewcake.com/', icon: '🍰' }
    ],
    'Productivity Tools': [
      { name: 'Notion', url: 'https://www.notion.so/', icon: '📝' },
      { name: 'Trello', url: 'https://trello.com/', icon: '📋' },
      { name: 'Todoist', url: 'https://todoist.com/', icon: '✅' },
      { name: 'Grammarly', url: 'https://www.grammarly.com/', icon: '✏️' }
    ]
  };

  // Filter categories based on active filter
  const filteredCategories = Object.entries(toolDatabase).filter(([categoryName]) => {
    return activeFilter === 'All' || categoryName.includes(activeFilter);
  });

  // Track tool clicks
  const handleToolClick = (toolName) => {
    console.log('Tool clicked:', toolName);
    // Add analytics tracking here if needed
  };

  return (
    <div className="container">
      <h1>Knowledge Tools</h1>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tools..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />
      
      {/* Filter Buttons */}
      <div className="filter-container">
        {['All', ...Object.keys(toolDatabase)].map((filterName) => (
          <button
            key={filterName}
            className={`filter-button ${activeFilter === filterName ? 'active' : ''}`}
            onClick={() => setActiveFilter(filterName)}
          >
            {filterName}
          </button>
        ))}
      </div>
      
      {/* Video Section */}
      <div className="video-section">
        <div className="video-container">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/31EWjB_9Jig?si=CLLsduZtIEC4v04P" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
      
      {/* Tool Categories */}
      <div className="tool-categories">
        {filteredCategories.map(([categoryName, tools]) => {
          // Filter tools based on search term
          const filteredTools = tools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm)
          );
          
          if (filteredTools.length === 0) return null;
          
          return (
            <div key={categoryName} className="category">
              <h2>
                <span className="category-icon">
                  {categoryName === 'Resume Builders' && '📄'}
                  {categoryName === 'Job Sites' && '💼'}
                  {categoryName === 'IDEs & Dev Tools' && '💻'}
                  {categoryName === 'Learning Resources' && '📚'}
                  {categoryName === 'Interview Prep' && '🎯'}
                  {categoryName === 'Productivity Tools' && '⚡'}
                </span>
                {categoryName}
              </h2>
              <div className="tool-grid">
                {filteredTools.map((tool) => (
                  <div key={tool.name} className="tool-item">
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="tool-link"
                      onClick={() => handleToolClick(tool.name)}
                    >
                      <div className="tool-icon">{tool.icon}</div>
                      <span className="tool-name">{tool.name}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CSS (can be placed in a separate file or using CSS-in-JS)
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
  }

  /* Video Section */
  .video-section {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 40px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    overflow: hidden;
    border-radius: 8px;
    background-color: #000;
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  /* Tool Categories Grid */
  .tool-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }

  .category {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .category:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  }

  .category h2 {
    color: #3498db;
    margin-bottom: 20px;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }

  .tool-item {
    text-align: center;
  }

  .tool-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: #333;
    padding: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .tool-link:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }

  .tool-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
    background-color: #e0e0e0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .tool-name {
    font-size: 14px;
    font-weight: 500;
  }

  /* Search Input */
  .search-input {
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    display: block;
    padding: 12px 20px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3498db;
  }

  /* Filter Container */
  .filter-container {
    text-align: center;
    margin: 20px 0;
  }

  .filter-button {
    margin: 5px;
    padding: 8px 16px;
    border: 2px solid #3498db;
    background: white;
    color: #3498db;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 500;
  }

  .filter-button:hover {
    background: #3498db;
    color: white;
  }

  .filter-button.active {
    background: #3498db;
    color: white;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    .tool-categories {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .category h2 {
      font-size: 1.25rem;
    }
    
    .tool-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 10px;
    }
    
    .category {
      padding: 15px;
    }
    
    .tool-link {
      padding: 10px;
    }
    
    .tool-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    
    .tool-name {
      font-size: 12px;
    }
    
    .filter-button {
      padding: 6px 12px;
      font-size: 12px;
      margin: 3px;
    }
  }
`;

// Component that injects the CSS
const KnowledgeToolsWithStyles = () => (
  <>
    <style>{styles}</style>
    <KnowledgeTools />
  </>
);

export default KnowledgeToolsWithStyles;