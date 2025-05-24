/* InterviewPrepStyles.js - Styles for the Interview Preparation component */
export const addInterviewPrepStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Interview Prep Container */
    .interview-prep-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 180px);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Header Section */
    .interview-prep-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .interview-prep-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .interview-prep-subtitle {
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    }
    
    .create-set-btn {
      background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
    }
    
    .create-set-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
    }
    
    /* Search and Filter Section */
    .search-filter-section {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      margin-bottom: 30px;
      border: 1px solid #e2e8f0;
    }
    
    .search-filter-controls {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .search-container {
      flex: 1;
      min-width: 300px;
      position: relative;
    }
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      background: #f8fafc;
      transition: all 0.2s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #4a6cf7;
      background: white;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
    }
    
    .domain-filter {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .domain-select {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      min-width: 180px;
      color: #1e293b;
      font-weight: 500;
    }
    
    .results-summary {
      margin-top: 16px;
      padding: 8px 16px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }
    
    /* Question Sets Grid */
    .question-sets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }
    
    /* Question Set Card */
    .question-set-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .question-set-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .domain-tag {
      display: inline-block;
      padding: 4px 12px;
      background: linear-gradient(135deg, #e0e7ff, #f0f5ff);
      color: #4338ca;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #c7d2fe;
    }
    
    .card-actions {
      display: flex;
      gap: 8px;
    }
    
    .edit-btn, .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    
    .edit-btn {
      color: #4a6cf7;
    }
    
    .edit-btn:hover {
      background: #f0f5ff;
    }
    
    .delete-btn {
      color: #ef4444;
    }
    
    .delete-btn:hover {
      background: #fef2f2;
    }
    
    /* Questions Section */
    .questions-section {
      margin-bottom: 16px;
    }
    
    .questions-title {
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .questions-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .question-item {
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .question-text {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      margin: 0;
      flex: 1;
      line-height: 1.4;
    }
    
    .question-number {
      color: #4a6cf7;
      font-weight: 600;
    }
    
    .toggle-answer-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      margin-left: 8px;
      transition: all 0.2s ease;
    }
    
    .toggle-answer-btn:hover {
      background: #e2e8f0;
    }
    
    .answer-container {
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      margin-top: 8px;
    }
    
    .answer-text {
      font-size: 13px;
      color: #475569;
      margin: 0;
      line-height: 1.5;
    }
    
    .answer-label {
      color: #059669;
      font-weight: 600;
    }
    
    /* Card Footer */
    .card-footer {
      font-size: 12px;
      color: #94a3b8;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }
    
    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .modal-close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    
    .modal-close-btn:hover {
      background: #f1f5f9;
      color: #ef4444;
    }
    
    .modal-body {
      padding: 24px;
      max-height: calc(90vh - 140px);
      overflow-y: auto;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #334155;
      font-size: 14px;
    }
    
    .form-input, .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #4a6cf7;
    }
    
    .form-select {
      background: white;
      cursor: pointer;
    }
    
    /* Questions Form Section */
    .questions-form-section {
      margin-bottom: 24px;
    }
    
    .questions-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .add-question-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    
    .add-question-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .questions-form-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
    }
    
    .question-form-item {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #e2e8f0;
      position: relative;
    }
    
    .question-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .question-badge {
      font-size: 12px;
      font-weight: 600;
      color: #4a6cf7;
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #e0e7ff;
    }
    
    .remove-question-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .remove-question-btn:hover {
      background: #fef2f2;
    }
    
    .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 13px;
      resize: vertical;
      transition: all 0.2s ease;
    }
    
    .form-textarea:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
    }
    
    .question-textarea {
      min-height: 60px;
    }
    
    .answer-textarea {
      min-height: 80px;
    }
    
    /* Modal Footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
      position: sticky;
      bottom: 0;
    }
    
    .cancel-btn {
      padding: 10px 20px;
      border: 2px solid #e5e7eb;
      background: white;
      color: #374151;
      border-radius: 8px;
      font-weight: 500;
      cursor: 'pointer';
      transition: all 0.2s ease;
    }
    
    .cancel-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
    
    .submit-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(74, 108, 247, 0.3);
    }
    
    .submit-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.4);
    }
    
    /* Delete Modal */
    .delete-modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    .delete-modal-body {
      padding: 24px;
      text-align: center;
    }
    
    .delete-icon-container {
      width: 48px;
      height: 48px;
      background: #fef2f2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    
    .delete-modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .delete-modal-text {
      color: #64748b;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    
    .delete-modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .delete-confirm-btn {
      padding: 10px 20px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .delete-confirm-btn:hover {
      background: #dc2626;
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
    }
    
    .empty-state-icon {
      margin-bottom: 16px;
      color: #94a3b8;
    }
    
    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .empty-state-text {
      color: #64748b;
      font-size: 1rem;
      margin: 0 0 24px 0;
    }
    
    .empty-state-btn {
      background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    /* Loading State */
    .loading-container {
      text-align: center;
      padding: 60px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #4a6cf7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .interview-prep-container {
        padding: 16px;
      }
      
      .interview-prep-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .interview-prep-title {
        font-size: 1.75rem;
      }
      
      .create-set-btn {
        width: 100%;
        justify-content: center;
      }
      
      .search-filter-controls {
        flex-direction: column;
        gap: 16px;
      }
      
      .search-container {
        min-width: 0;
        width: 100%;
      }
      
      .domain-filter {
        width: 100%;
      }
      
      .domain-select {
        min-width: 0;
        width: 100%;
      }
      
      .question-sets-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .modal-content {
        width: 95%;
        margin: 16px;
      }
      
      .modal-header {
        padding: 20px;
      }
      
      .modal-body {
        padding: 20px;
      }
      
      .modal-footer {
        padding: 16px 20px;
        flex-direction: column-reverse;
        gap: 10px;
      }
      
      .cancel-btn, .submit-btn {
        width: 100%;
      }
      
      .questions-form-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .add-question-btn {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .interview-prep-title {
        font-size: 1.5rem;
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
      
      .search-filter-section {
        padding: 20px;
      }
      
      .question-set-card {
        padding: 20px;
      }
      
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .card-actions {
        align-self: flex-end;
      }
      
      .modal-header {
        padding: 16px;
      }
      
      .modal-body {
        padding: 16px;
      }
      
      .modal-footer {
        padding: 12px 16px;
      }
      
      .question-form-item {
        padding: 12px;
      }
      
      .questions-form-list {
        padding: 12px;
      }
    }
    
    /* Focus States for Accessibility */
    .create-set-btn:focus,
    .edit-btn:focus,
    .delete-btn:focus,
    .toggle-answer-btn:focus,
    .add-question-btn:focus,
    .remove-question-btn:focus,
    .modal-close-btn:focus,
    .cancel-btn:focus,
    .submit-btn:focus,
    .delete-confirm-btn:focus {
      outline: 2px solid #4a6cf7;
      outline-offset: 2px;
    }
    
    .search-input:focus,
    .domain-select:focus,
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
    }
    
    /* Smooth Transitions */
    * {
      transition: all 0.2s ease;
    }
    
    /* Custom Scrollbar */
    .questions-list::-webkit-scrollbar,
    .questions-form-list::-webkit-scrollbar,
    .modal-body::-webkit-scrollbar {
      width: 6px;
    }
    
    .questions-list::-webkit-scrollbar-track,
    .questions-form-list::-webkit-scrollbar-track,
    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .questions-list::-webkit-scrollbar-thumb,
    .questions-form-list::-webkit-scrollbar-thumb,
    .modal-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .questions-list::-webkit-scrollbar-thumb:hover,
    .questions-form-list::-webkit-scrollbar-thumb:hover,
    .modal-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    document.head.removeChild(styleElement);
  };
};