/* CompanyDirectoryStyles.js - Styles for Company Directory Component */
export const addCompanyDirectoryStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Company Directory Container */
    .company-directory-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: calc(100vh - 180px);
    }

    /* Header */
    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      gap: 20px;
    }

    .header-content {
      flex: 1;
    }

    .company-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .company-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      margin: 0;
    }

    .add-company-button {
      background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
    }

    .add-company-button:hover {
      background: linear-gradient(135deg, #3b5ce4, #2d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(74, 108, 247, 0.4);
    }

    /* Search and Filter */
    .search-filter-container {
      display: flex;
      gap: 16px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 2;
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 0 16px;
      transition: all 0.2s ease;
    }

    .search-box:focus-within {
      border-color: #4a6cf7;
      box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
    }

    .search-box svg {
      color: #64748b;
      margin-right: 12px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 14px 0;
      font-size: 16px;
      background: transparent;
    }

    .filter-box {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 0 16px;
      min-width: 200px;
    }

    .filter-box svg {
      color: #64748b;
      margin-right: 12px;
    }

    .filter-select {
      flex: 1;
      border: none;
      outline: none;
      padding: 14px 0;
      font-size: 16px;
      background: transparent;
      cursor: pointer;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }

    .loading-icon {
      color: #4a6cf7;
      margin-bottom: 16px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Companies Grid */
    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .company-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f1f5f9;
      position: relative;
      overflow: hidden;
    }

    .company-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4a6cf7, #3b5ce4);
    }

    .company-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    }

    .company-header-card {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .company-info-header {
      flex: 1;
    }

    .company-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .service-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #f0f5ff, #e0e7ff);
      color: #4338ca;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid #c7d2fe;
    }

    .service-emoji {
      font-size: 14px;
    }

    .company-actions {
      display: flex;
      gap: 8px;
      margin-left: 12px;
    }

    .edit-company-btn,
    .delete-company-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .edit-company-btn {
      color: #4a6cf7;
    }

    .edit-company-btn:hover {
      background: #f0f5ff;
      color: #3b5ce4;
    }

    .delete-company-btn {
      color: #ef4444;
    }

    .delete-company-btn:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .company-description {
      color: #64748b;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .company-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }

    .company-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 14px;
    }

    .company-detail svg {
      color: #94a3b8;
    }

    .company-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .company-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .website-link {
      background: #f0fdf4;
      color: #16a34a;
      border-color: #bbf7d0;
    }

    .website-link:hover {
      background: #dcfce7;
      transform: translateY(-1px);
    }

    .linkedin-link {
      background: #eff6ff;
      color: #2563eb;
      border-color: #bfdbfe;
    }

    .linkedin-link:hover {
      background: #dbeafe;
      transform: translateY(-1px);
    }

    .career-link {
      background: #fef3c7;
      color: #d97706;
      border-color: #fde68a;
    }

    .career-link:hover {
      background: #fef08a;
      transform: translateY(-1px);
    }

    .company-footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .added-date {
      font-size: 12px;
      color: #94a3b8;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .empty-icon {
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .empty-description {
      color: #64748b;
      font-size: 16px;
      max-width: 400px;
      margin: 0 auto 24px;
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
      border-radius: 16px;
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 10;
    }

    .modal-top h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }

    .close-button {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      color: #ef4444;
      background: #fef2f2;
    }

    .modal-form {
      padding: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #374155;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      background: white;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .form-select {
      cursor: pointer;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
      position: sticky;
      bottom: 0;
      background-color: white;
    }

    .cancel-button,
    .submit-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .cancel-button {
      background-color: #f1f5f9;
      color: #475569;
    }

    .cancel-button:hover {
      background-color: #e2e8f0;
    }

    .submit-button {
      background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
      color: white;
    }

    .submit-button:hover {
      background: linear-gradient(135deg, #3b5ce4, #2d4ed8);
      transform: translateY(-1px);
    }

    .delete-confirm-button {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .delete-confirm-button:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .company-directory-container {
        padding: 16px;
      }

      .company-header {
        flex-direction: column;
        align-items: stretch;
      }

      .company-title {
        font-size: 2rem;
      }

      .search-filter-container {
        flex-direction: column;
      }

      .filter-box {
        min-width: auto;
      }

      .companies-grid {
        grid-template-columns: 1fr;
      }

      .company-card {
        padding: 20px;
      }

      .company-header-card {
        flex-direction: column;
        gap: 12px;
      }

      .company-actions {
        margin-left: 0;
        align-self: flex-end;
      }

      .company-links {
        flex-direction: column;
        align-items: stretch;
      }

      .company-link {
        justify-content: center;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .modal-content {
        width: 95%;
      }

      .modal-top {
        padding: 20px;
      }

      .modal-form {
        padding: 20px;
      }

      .modal-actions {
        padding: 20px;
        flex-direction: column-reverse;
      }

      .cancel-button,
      .submit-button {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .company-title {
        font-size: 1.75rem;
      }

      .company-card {
        padding: 16px;
      }

      .search-box,
      .filter-box {
        padding: 0 12px;
      }

      .search-input,
      .filter-select {
        padding: 12px 0;
      }
    }

    /* Focus states for accessibility */
    .add-company-button:focus,
    .edit-company-btn:focus,
    .delete-company-btn:focus,
    .close-button:focus,
    .cancel-button:focus,
    .submit-button:focus,
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus,
    .search-input:focus,
    .filter-select:focus {
      outline: 2px solid #4a6cf7;
      outline-offset: 2px;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .company-card {
        border: 2px solid #000;
      }
      
      .service-badge {
        border-width: 2px;
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

    /* Print styles */
    @media print {
      .company-actions,
      .add-company-button,
      .search-filter-container {
        display: none;
      }
      
      .company-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
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