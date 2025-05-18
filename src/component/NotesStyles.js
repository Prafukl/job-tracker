/* NotesStyles.js - Styles for the Notes component */
export const addNotesStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Notes Container Styles */
    .notes-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 180px);
    }
    
    .notes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .notes-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .notes-actions {
      display: flex;
      gap: 12px;
    }
    
    .create-note-btn {
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
    
    .create-note-btn:hover {
      background-color: #3b5ce4;
      transform: translateY(-2px);
    }
    
    /* Notes List Styles */
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .note-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 300px;
      border: 1px solid #e2e8f0;
    }
    
    .note-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .note-header {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .note-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80%;
    }
    
    .note-date {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 4px;
    }
    
    .note-content {
      padding: 16px;
      flex-grow: 1;
      overflow: hidden;
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.5;
      position: relative;
    }
    
    .note-content-preview {
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    
    .note-content-preview::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
    
    .note-content img {
      max-width: 100%;
      height: auto;
      margin: 8px 0;
      border-radius: 4px;
    }
    
    .note-content a {
      color: #4a6cf7;
      text-decoration: none;
    }
    
    .note-content a:hover {
      text-decoration: underline;
    }
    
    .note-footer {
      padding: 12px 16px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .note-action-btn {
      background: none;
      border: none;
      padding: 6px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .edit-btn {
      color: #4a6cf7;
    }
    
    .delete-btn {
      color: #ef4444;
    }
    
    .note-action-btn:hover {
      background-color: #f1f5f9;
    }
    
    /* Note Editor Styles */
    .note-editor-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }
    
    .note-editor {
      background-color: white;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .editor-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .editor-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .editor-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }
    
    .editor-close:hover {
      color: #ef4444;
    }
    
    .editor-body {
      padding: 20px;
      flex-grow: 1;
      overflow-y: auto;
    }
    
    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .editor-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .editor-label {
      font-weight: 500;
      color: #334155;
      font-size: 0.95rem;
    }
    
    .editor-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }
    
    .editor-input:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
    }
    
    .rich-editor-container {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      min-height: 300px;
    }
    
    .rich-editor-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 8px;
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    .toolbar-btn {
      background: none;
      border: none;
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    
    .toolbar-btn:hover {
      background-color: #e2e8f0;
    }
    
    .toolbar-btn.active {
      background-color: #e0e7ff;
      color: #4a6cf7;
    }
    
    .toolbar-divider {
      width: 1px;
      height: 24px;
      background-color: #e2e8f0;
      margin: 0 4px;
    }
    
    .rich-editor-content {
      padding: 16px;
      min-height: 250px;
      max-height: 400px;
      overflow-y: auto;
      background-color: white;
      border: none;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      direction: ltr;
      text-align: left;
      outline: none;
      transition: border 0.3s ease;
    }
    
    .rich-editor-content.drag-over {
      background-color: #f0f7ff;
      border: 2px dashed #4a6cf7;
    }
    
    .rich-editor-content:focus {
      outline: none;
    }
    
    .rich-editor-content p {
      margin-bottom: 12px;
    }
    
    .rich-editor-content h1, 
    .rich-editor-content h2, 
    .rich-editor-content h3, 
    .rich-editor-content h4, 
    .rich-editor-content h5, 
    .rich-editor-content h6 {
      margin-top: 16px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .rich-editor-content ul, 
    .rich-editor-content ol {
      margin-bottom: 16px;
      margin-left: 24px;
    }
    
    .rich-editor-content li {
      margin-bottom: 4px;
    }
    
    .rich-editor-content a {
      color: #4a6cf7;
      text-decoration: none;
    }
    
    .rich-editor-content a:hover {
      text-decoration: underline;
    }
    
    .rich-editor-content img {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
      border-radius: 4px;
    }
    
    .rich-editor-content pre {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-family: monospace;
      white-space: pre-wrap;
      margin-bottom: 16px;
      border: 1px solid #e0e0e0;
    }
    
    .image-upload-container {
      margin-top: 10px;
      padding: 10px;
      border: 1px dashed #e2e8f0;
      border-radius: 6px;
      background-color: #f8fafc;
    }
    
    .image-upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      cursor: pointer;
      text-align: center;
      color: #64748b;
    }
    
    .image-preview {
      margin-top: 10px;
      padding: 10px;
      border-radius: 6px;
      background-color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .preview-image {
      max-width: 80px;
      max-height: 80px;
      border-radius: 4px;
    }
    
    .editor-footer {
      padding: 16px 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background-color: #f8fafc;
    }
    
    .editor-btn {
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .cancel-btn {
      background-color: #f1f5f9;
      color: #475569;
    }
    
    .save-btn {
      background-color: #4a6cf7;
      color: white;
    }
    
    .cancel-btn:hover {
      background-color: #e2e8f0;
    }
    
    .save-btn:hover {
      background-color: #3b5ce4;
    }
    
    /* Empty state */
    .empty-notes {
      text-align: center;
      padding: 60px 20px;
      background-color: rgba(245, 247, 250, 0.8);
      border-radius: 16px;
      border: 2px dashed #d1d5db;
      margin-top: 30px;
    }
    
    .empty-notes-icon {
      font-size: 50px;
      color: #94a3b8;
      margin-bottom: 20px;
    }
    
    .empty-notes h3 {
      font-size: 24px;
      color: #1e293b;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .empty-notes p {
      color: #64748b;
      margin-bottom: 25px;
      font-size: 16px;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 640px) {
      .notes-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .notes-actions {
        width: 100%;
      }
      
      .create-note-btn {
        width: 100%;
        justify-content: center;
      }
      
      .note-editor {
        width: 95%;
        max-height: 95vh;
      }
      
      .editor-footer {
        flex-direction: column-reverse;
      }
      
      .editor-btn {
        width: 100%;
        text-align: center;
      }
      
      .rich-editor-toolbar {
        overflow-x: auto;
        justify-content: flex-start;
        padding-bottom: 12px;
      }
    }
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    document.head.removeChild(styleElement);
  };
};