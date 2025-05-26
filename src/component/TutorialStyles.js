/* TutorialStyles.js - Enhanced styles for the Tutorial component */
export const addTutorialStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Tutorial Container */
    .tutorial-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 180px);
    }
    
    .tutorial-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .tutorial-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .tutorial-actions {
      display: flex;
      gap: 12px;
    }
    
    .upload-button {
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
    
    .upload-button:hover {
      background-color: #3b5ce4;
      transform: translateY(-2px);
    }
    
    /* Category Filters */
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 25px;
    }
    
    .filter-button {
      padding: 8px 16px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .filter-button:hover {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
    }
    
    .filter-button.active {
      background-color: #4a6cf7;
      border-color: #4a6cf7;
      color: white;
    }
    
    /* Tutorial Cards */
    .tutorials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 25px;
    }
    
    .tutorial-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background-color: white;
      position: relative;
    }
    
    .tutorial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    .tutorial-thumbnail {
      position: relative;
      aspect-ratio: 16 / 9;
      background-color: #f1f5f9;
      overflow: hidden;
    }
    
    .tutorial-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .tutorial-card:hover .tutorial-thumbnail img {
      transform: scale(1.05);
    }
    
    .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .play-button:hover {
      background-color: white;
      transform: translate(-50%, -50%) scale(1.1);
    }
    
    .tutorial-info {
      padding: 16px;
    }
    
    /* Enhanced Tutorial Tags */
    .tutorial-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .tutorial-category {
      display: inline-block;
      padding: 4px 12px;
      background-color: #e0e7ff;
      color: #4338ca;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .tutorial-subdomain {
      display: inline-block;
      padding: 4px 12px;
      background-color: #f0fdf4;
      color: #16a34a;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid #bbf7d0;
    }
    
    .tutorial-info-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .tutorial-description {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 10px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .tutorial-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #f1f5f9;
    }
    
    .tutorial-date {
      font-size: 13px;
      color: #94a3b8;
    }
    
    .tutorial-actions-menu {
      display: flex;
      gap: 8px;
    }
    
    .edit-tutorial-btn {
      background: none;
      border: none;
      color: #4a6cf7;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .edit-tutorial-btn:hover {
      background-color: #f0f5ff;
    }
    
    .delete-button {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .delete-button:hover {
      background-color: #fef2f2;
    }
    
    /* Tutorial Edit Form Styles */
    .tutorial-edit-form {
      padding: 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 2px solid #4a6cf7;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(74, 108, 247, 0.15);
      position: relative;
      min-height: 400px;
    }
    
    .edit-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .edit-form-header h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .edit-form-header h3::before {
      content: "✏️";
      font-size: 18px;
    }
    
    .edit-actions {
      display: flex;
      gap: 12px;
    }
    
    .save-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .save-btn:hover {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }
    
    .cancel-btn {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .cancel-btn:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }
    
    .edit-form-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: end;
    }
    
    .form-row .form-group {
      margin: 0;
    }
    
    /* Special styling for category and subdomain labels */
    .form-group label[for="category"]::before,
    .form-group label:has(+ select[name="category"])::before {
      content: "📂";
    }
    
    .form-group label[for="subdomain"]::before,
    .form-group label:has(+ select[name="subdomain"])::before {
      content: "🏷️";
    }
    
    .form-group label:has(+ textarea)::before {
      content: "📄";
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374155;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .form-group label::before {
      content: "📝";
      font-size: 12px;
    }
    
    .form-input,
    .form-select,
    .form-textarea {
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;
      background: #ffffff;
      font-family: inherit;
    }
    
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
      transform: translateY(-1px);
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
    }
    
    .form-select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 16px;
      padding-right: 40px;
      appearance: none;
    }
    
    /* Modal Styles */
    .modal-overlay {
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
      backdrop-filter: blur(3px);
    }
    
    .modal-content {
      background-color: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 10;
    }
    
    .modal-top h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .close-button {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: color 0.2s ease;
    }
    
    .close-button:hover {
      color: #ef4444;
    }
    
    .modal-form {
      padding: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #334155;
      font-size: 14px;
    }
    
    .type-selector {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .type-option {
      flex: 1;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .type-option:hover {
      background-color: #f8fafc;
    }
    
    .type-option.active {
      border-color: #4a6cf7;
      background-color: #f0f5ff;
    }
    
    .type-option-icon {
      color: #64748b;
    }
    
    .type-option.active .type-option-icon {
      color: #4a6cf7;
    }
    
    .type-option-label {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
    }
    
    .file-upload-container {
      margin-bottom: 20px;
    }
    
    .file-upload-input-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: #f8fafc;
    }
    
    .file-upload-input-container:hover {
      border-color: #4a6cf7;
      background-color: #f0f5ff;
    }
    
    .file-upload-icon {
      color: #64748b;
      margin-bottom: 12px;
    }
    
    .file-upload-text {
      font-size: 14px;
      color: #334155;
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .file-upload-hint {
      font-size: 12px;
      color: #64748b;
    }
    
    .file-upload-input {
      display: none;
    }
    
    .file-preview {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-top: 15px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .file-preview-icon {
      color: #4a6cf7;
      margin-right: 10px;
    }
    
    .file-preview-info {
      flex: 1;
    }
    
    .file-preview-name {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      margin-bottom: 3px;
    }
    
    .file-preview-size {
      font-size: 12px;
      color: #64748b;
    }
    
    .file-preview-remove {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .file-preview-remove:hover {
      color: #ef4444;
    }
    
    .progress-bar {
      height: 6px;
      width: 100%;
      background-color: #e2e8f0;
      border-radius: 3px;
      margin-top: 15px;
      overflow: hidden;
    }
    
    .progress-bar-fill {
      height: 100%;
      background-color: #4a6cf7;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      position: sticky;
      bottom: 0;
      background-color: white;
    }
    
    .cancel-button,
    .submit-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .cancel-button {
      background-color: #f1f5f9;
      color: #475569;
      border: none;
    }
    
    .submit-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
    }
    
    .cancel-button:hover {
      background-color: #e2e8f0;
    }
    
    .submit-button:hover {
      background-color: #3b5ce4;
    }
    
    .submit-button:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
    
    .delete-confirm-button {
      background-color: #ef4444;
    }
    
    .delete-confirm-button:hover {
      background-color: #dc2626;
    }
    
    /* Video Modal */
    .video-modal-content {
      width: 90%;
      max-width: 900px;
      aspect-ratio: 16 / 9;
      background-color: black;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    
    .video-modal-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: background-color 0.2s ease;
    }
    
    .video-modal-close:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    .video-player {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .video-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      margin-top: 40px;
    }
    
    .empty-icon {
      font-size: 50px;
      color: #94a3b8;
      margin-bottom: 20px;
    }
    
    .empty-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }
    
    .empty-description {
      color: #64748b;
      font-size: 16px;
      max-width: 400px;
      margin: 0 auto 20px;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .tutorial-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .tutorial-title {
        font-size: 1.75rem;
      }
      
      .tutorial-actions {
        width: 100%;
      }
      
      .upload-button {
        width: 100%;
        justify-content: center;
      }
      
      .filter-container {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 10px;
        -webkit-overflow-scrolling: touch;
      }
      
      .filter-button {
        white-space: nowrap;
      }
      
      .tutorials-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      
      .modal-content {
        width: 95%;
      }
      
      .type-selector {
        flex-direction: column;
      }
      
      .modal-actions {
        flex-direction: column-reverse;
        gap: 10px;
      }
      
      .cancel-button,
      .submit-button {
        width: 100%;
      }
      
      .form-row {
        flex-direction: column;
        gap: 12px;
      }
      
      .edit-form-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .edit-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
    
    @media (max-width: 480px) {
      .tutorial-container {
        padding: 16px;
      }
      
      .tutorial-header {
        gap: 12px;
      }
      
      .tutorial-title {
        font-size: 1.5rem;
      }
      
      .tutorials-grid {
        grid-template-columns: 1fr;
      }
      
      .tutorial-edit-form {
        padding: 16px;
      }
      
      .tutorial-tags {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      
      .modal-top {
        padding: 16px;
      }
      
      .modal-form {
        padding: 16px;
      }
      
      .modal-actions {
        padding: 16px;
      }
    }
    
    /* Animation for smooth transitions */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .tutorial-edit-form {
      animation: slideIn 0.4s ease-out;
    }
    
    /* Hover effects for better interaction */
    .tutorial-card:not(:has(.tutorial-edit-form)):hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    .tutorial-card:has(.tutorial-edit-form) {
      transform: none !important;
      box-shadow: 0 12px 30px rgba(74, 108, 247, 0.2) !important;
    }
    
    /* Focus states for accessibility */
    .upload-button:focus,
    .filter-button:focus,
    .edit-tutorial-btn:focus,
    .delete-button:focus,
    .save-btn:focus,
    .cancel-btn:focus,
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: 2px solid #4a6cf7;
      outline-offset: 2px;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .tutorial-card {
        border: 2px solid #000;
      }
      
      .tutorial-edit-form {
        border-width: 3px;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    if (document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  };
};