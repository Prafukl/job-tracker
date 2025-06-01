/* KnowledgeBaseStyles.js - Styles for Knowledge Base component */
export const addKnowledgeBaseStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Knowledge Base Container */
    .kb-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 180px);
    }
    
    .kb-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }
    
    .kb-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .kb-subtitle {
      color: #64748b;
      margin: 0;
    }
    
    .kb-add-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    
    .kb-add-button:hover {
      background-color: #3b5ce4;
      transform: translateY(-2px);
    }
    
    /* Search and Filter */
    .kb-search-filter {
      display: flex;
      gap: 16px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .kb-search, .kb-filter {
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 0 16px;
      min-width: 200px;
      flex: 1;
    }
    
    .kb-search input, .kb-filter select {
      flex: 1;
      border: none;
      outline: none;
      padding: 12px 0;
      font-size: 16px;
      background: transparent;
    }
    
    .kb-search svg, .kb-filter svg {
      color: #64748b;
      margin-right: 12px;
    }
    
    /* Articles Grid */
    .kb-articles {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    /* Article Card */
    .kb-article-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .kb-article-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .kb-article-header {
      padding: 20px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .kb-article-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      flex: 1;
    }
    
    .kb-article-domain {
      background-color: #f0f5ff;
      color: #4338ca;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .kb-article-content {
      padding: 20px;
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
    }
    
    .kb-article-images {
      padding: 0 20px 20px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .kb-article-image {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .kb-article-video {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 20px 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  background-color: #000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.kb-article-video:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.kb-video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
    
    .kb-article-footer {
      padding: 15px 20px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .kb-article-date {
      color: #94a3b8;
      font-size: 0.875rem;
    }
    
    .kb-article-actions {
      display: flex;
      gap: 10px;
    }
    
    .kb-edit-button, .kb-delete-button {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .kb-edit-button {
      color: #4a6cf7;
    }
    
    .kb-edit-button:hover {
      background-color: #f0f5ff;
    }
    
    .kb-delete-button {
      color: #ef4444;
    }
    
    .kb-delete-button:hover {
      background-color: #fef2f2;
    }
    
    /* Empty State */
    .kb-empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .kb-empty-state svg {
      color: #94a3b8;
      margin-bottom: 16px;
    }
    
    .kb-empty-state h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .kb-empty-state p {
      color: #64748b;
      margin: 0 0 20px 0;
    }
    
    .kb-loading {
      text-align: center;
      padding: 40px;
      color: #64748b;
    }
    
    /* Modal Styles */
    .kb-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .kb-modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    }
    
    .kb-delete-modal {
      max-width: 500px;
    }
    
    .kb-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
    }
    
    .kb-modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .kb-modal-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0;
    }
    
    .kb-modal-close:hover {
      color: #ef4444;
    }
    
    .kb-modal-content {
      padding: 20px;
    }
    
    .kb-form-group {
      margin-bottom: 20px;
    }
    
    .kb-form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #334155;
    }
    
    .kb-form-group input,
    .kb-form-group select,
    .kb-form-group textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
    }
    
    .kb-form-group input:focus,
    .kb-form-group select:focus,
    .kb-form-group textarea:focus {
      outline: none;
      border-color: #4a6cf7;
    }
    
    .kb-form-help {
      display: block;
      margin-top: 5px;
      font-size: 12px;
      color: #64748b;
    }
    
    .kb-image-upload {
      margin-top: 8px;
    }
    
    .kb-upload-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #f8fafc;
      border: 2px dashed #cbd5e1;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .kb-upload-button:hover:not(:disabled) {
      background-color: #f1f5f9;
      border-color: #94a3b8;
    }
    
    .kb-upload-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .kb-image-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    
    .kb-image-preview {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      aspect-ratio: 1;
    }
    
    .kb-image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .kb-remove-image {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .kb-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
    
    .kb-cancel-button,
    .kb-submit-button,
    .kb-delete-confirm-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .kb-cancel-button {
      background-color: #f1f5f9;
      color: #475569;
      border: none;
    }
    
    .kb-submit-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
    }
    
    .kb-delete-confirm-button {
      background-color: #ef4444;
      color: white;
      border: none;
    }
    
    .kb-cancel-button:hover {
      background-color: #e2e8f0;
    }
    
    .kb-submit-button:hover {
      background-color: #3b5ce4;
    }
    
    .kb-delete-confirm-button:hover {
      background-color: #dc2626;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .kb-header {
        flex-direction: column;
        gap: 16px;
      }
      
      .kb-add-button {
        width: 100%;
      }
      
      .kb-search-filter {
        flex-direction: column;
      }
      
      .kb-article-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .kb-article-domain {
        align-self: flex-start;
      }
      
      .kb-modal-actions {
        flex-direction: column-reverse;
      }
      
      .kb-cancel-button,
      .kb-submit-button,
      .kb-delete-confirm-button {
        width: 100%;
      }
    }
      /* Video styling in the knowledge base */
.kb-article-video {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 20px 0;
  overflow: hidden;
  border-radius: 8px;
}

.kb-video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
  /* Video thumbnail overlay effect (optional) */
.kb-video-with-thumbnail {
  position: relative;
  cursor: pointer;
}

.kb-video-thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  z-index: 1;
}

.kb-play-button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.kb-play-button-overlay svg {
  color: #ff0000;
  width: 30px;
  height: 30px;
}

.kb-video-with-thumbnail:hover .kb-play-button-overlay {
  background-color: rgba(255, 255, 255, 0.95);
  transform: translate(-50%, -50%) scale(1.1);
}

/* Video title bar (optional) */
.kb-video-title-bar {
  background: linear-gradient(to right, #4a6cf7, #3b5ce4);
  color: white;
  padding: 12px 20px;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: -5px; /* Connect with video container */
  position: relative;
  z-index: 5;
}

.kb-video-title-bar svg {
  color: #fff;
}
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    if (document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  };
};