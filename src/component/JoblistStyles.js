export const addJoblistStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    /* Card Actions Styling */
    .card-actions {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }
    
    .edit-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      color: #4a6cf7;
      transition: all 0.2s;
    }
    
    .edit-button:hover {
      transform: scale(1.1);
      color: #3151d4;
    }

    /* Filter Section Styling */
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 15px;
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: white;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }

    .filter-icon {
      color: #64748b;
    }

    .filter-select {
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      cursor: pointer;
      outline: none;
      min-width: 150px;
    }

    .filter-select:focus {
      outline: none;
    }

    /* Status Badge Enhancements */
    .status-not-applied {
      background-color: #f1f5f9;
      color: #64748b;
    }

    .status-applied {
      background-color: #e1f0fa;
      color: #3498db;
    }

    .status-interview {
      background-color: #fef5e6;
      color: #f39c12;
    }

    .status-offer {
      background-color: #e8f8ee;
      color: #2ecc71;
    }

    .status-rejected {
      background-color: #fae6e6;
      color: #e74c3c;
    }

    /* Domain Tag Styling */
    .domain-info {
      margin-top: 8px;
    }

    .domain-tag {
      display: inline-block;
      padding: 4px 10px;
      background-color: #f0f5ff;
      color: #4338ca;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #e0e7ff;
    }
    
    /* Enhanced Modal Styling */
    .modal-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(3px);
    }
    
    .modal-content {
      width: 90%;
      max-width: 550px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .modal-top {
      position: sticky;
      top: 0;
      background-color: #f8f9fa;
      z-index: 10;
      border-bottom: 1px solid #e9ecef;
      padding: 18px 24px;
    }
    
    .modal-top h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .close-button {
      position: absolute;
      top: 16px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      color: #64748b;
      transition: color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 28px;
      height: 28px;
      border-radius: 6px;
    }
    
    .close-button:hover {
      color: #ef4444;
      background-color: #fee2e2;
    }
    
    .modal-form {
      padding: 20px 24px 24px;
    }
    
    /* Form Controls Styling */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #334155;
      font-size: 0.95rem;
    }
    
    .form-input, .form-textarea, select.form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: #fff;
    }
    
    .form-input:focus, .form-textarea:focus, select.form-input:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.15);
    }
    
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .form-row .form-group {
      flex: 1 1 200px;
      min-width: 0;
    }
    
    /* Calendar and Date Input Styling */
    input[type="date"].form-input {
      padding-right: 10px;
    }
    
    input[type="date"].form-input::-webkit-calendar-picker-indicator {
      opacity: 0.7;
      cursor: pointer;
    }
    
    input[type="date"].form-input::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
    
    /* Checkbox Styling */
    .checkbox-group {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }
    
    .form-checkbox {
      margin-right: 10px;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      accent-color: #4a6cf7;
    }
    
    /* Button Styling */
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e9ecef;
      background-color: #f8f9fa;
      position: sticky;
      bottom: 0;
    }
    
    .cancel-button, .submit-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .cancel-button {
      background-color: #f1f5f9;
      color: #475569;
    }
    
    .submit-button {
      background-color: #4a6cf7;
      color: white;
    }
    
    .cancel-button:hover {
      background-color: #e2e8f0;
    }
    
    .submit-button:hover {
      background-color: #3b5ce4;
      transform: translateY(-1px);
    }
    
    .delete-confirm-button {
      background-color: #ef4444 !important;
    }
    
    .delete-confirm-button:hover {
      background-color: #dc2626 !important;
    }
    
    /* Required Field Indicator */
    .form-label::after {
      content: '*';
      color: #ef4444;
      margin-left: 2px;
      display: none;
    }
    
    [required] + .form-label::after,
    label:has(+ [required])::after {
      display: inline;
    }
    
    /* Placeholder enhancement */
    .form-input::placeholder,
    .form-textarea::placeholder {
      color: #94a3b8;
      opacity: 1;
    }
    
    /* File Upload Styling */
    .file-upload-container {
      margin-bottom: 20px;
    }
    
    .file-upload-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #334155;
      font-size: 0.95rem;
    }
    
    .file-upload-input-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      transition: all 0.2s ease;
      background-color: #f8fafc;
      cursor: pointer;
      position: relative;
    }
    
    .file-upload-input-container:hover {
      border-color: #4a6cf7;
      background-color: #f0f5ff;
    }
    
    .file-upload-input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
    
    .file-upload-icon {
      color: #64748b;
      margin-bottom: 10px;
      font-size: 24px;
    }
    
    .file-upload-text {
      color: #475569;
      font-size: 0.95rem;
      margin-bottom: 5px;
    }
    
    .file-upload-hint {
      color: #94a3b8;
      font-size: 0.8rem;
    }
    
    .file-preview {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-top: 10px;
      background-color: #f1f5f9;
      border-radius: 6px;
      position: relative;
    }
    
    .file-preview-icon {
      color: #f43f5e;
      margin-right: 10px;
    }
    
    .file-preview-name {
      font-size: 0.9rem;
      color: #334155;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .file-preview-size {
      font-size: 0.8rem;
      color: #64748b;
      margin-right: 10px;
    }
    
    .file-preview-remove {
      background: none;
      border: none;
      cursor: pointer;
      color: #64748b;
      padding: 5px;
      transition: all 0.2s ease;
    }
    
    .file-preview-remove:hover {
      color: #ef4444;
    }
    
    /* PDF Viewer Modal */
    .pdf-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.85);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
    
    .pdf-modal-content {
      position: relative;
      width: 90%;
      height: 90%;
      max-width: 950px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .pdf-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    
    .pdf-modal-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .pdf-modal-close {
      background: none;
      border: none;
      color: #64748b;
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .pdf-modal-close:hover {
      color: #ef4444;
    }
    
    .pdf-modal-body {
      flex-grow: 1;
      overflow: auto;
    }
    
    .pdf-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    /* Resume Indicator */
    .resume-indicator {
      display: inline-flex;
      align-items: center;
      background-color: #f0f5ff;
      color: #4a6cf7;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-top: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .resume-indicator:hover {
      background-color: #e0e9ff;
    }
    
    .resume-indicator svg {
      margin-right: 5px;
    }

    /* Enhanced Controls Section */
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 15px;
      flex-wrap: wrap;
    }

    .add-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      white-space: nowrap;
    }
    
    .add-button:hover {
      background-color: #3b5ce4;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      .controls {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .filters-section {
        min-width: unset;
        width: 100%;
      }

      .filter-dropdowns {
        flex-direction: column;
        gap: 10px;
      }

      .filter-group {
        min-width: unset;
        width: 100%;
        justify-content: flex-start;
      }

      .filter-select {
        min-width: 0;
        width: 100%;
      }

      .add-button {
        width: 100%;
        text-align: center;
        justify-content: center;
      }
      
      .modal-content {
        width: 95%;
        max-height: 95vh;
        border-radius: 12px;
      }
      
      .modal-top {
        padding: 16px 20px;
      }
      
      .modal-form {
        padding: 16px 20px 20px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .form-row .form-group {
        flex: 1 1 100%;
      }
      
      .modal-actions {
        padding: 16px 20px;
        flex-direction: column-reverse;
        gap: 10px;
      }
      
      .cancel-button, .submit-button {
        width: 100%;
        padding: 12px;
      }
    }

    @media (max-width: 480px) {
      .search-group {
        padding: 8px 12px;
      }

      .search-input {
        font-size: 14px;
      }

      .filter-group {
        padding: 6px 10px;
      }

      .filter-select {
        font-size: 13px;
      }
    }
    
    /* Empty state enhancement */
    .empty-state {
      padding: 60px 20px;
      background-color: rgba(245, 247, 250, 0.8);
      border-radius: 16px;
      border: 2px dashed #d1d5db;
      text-align: center;
    }
    
    .empty-icon .icon {
      width: 70px;
      height: 70px;
      color: #94a3b8;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      font-size: 24px;
      color: #1e293b;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .empty-state p {
      color: #64748b;
      margin-bottom: 25px;
      font-size: 16px;
    }

    /* Delete Button Styles */
    .delete-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      color: #e74c3c;
      transition: all 0.2s;
      margin-left: auto;
    }

    .delete-button:hover {
      transform: scale(1.1);
    }

    /* Card Bottom Section */
    .card-bottom-section {
      display: flex;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid #eee;
      margin-top: 15px;
    }

    /* Application Card Enhancements */
    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 25px;
    }

    .application-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 25px;
      transition: all 0.3s ease;
      border: 1px solid #eaeaea;
      position: relative;
      overflow: hidden;
    }

    .application-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      border-color: #d0d0d0;
    }

    .application-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(to bottom, #4CAF50, #2196F3);
    }

    .card-top-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      align-items: flex-start;
    }

    .title-section {
      flex: 1;
      padding-right: 10px;
    }

    .job-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #2c3e50;
      line-height: 1.3;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      color: #555;
      margin-bottom: 8px;
    }

    .company-info .icon {
      width: 18px;
      height: 18px;
      color: #4CAF50;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .card-details {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      color: #555;
    }

    .detail-item .icon {
      width: 18px;
      height: 18px;
      color: #6e8efb;
    }

    .follow-up-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #555;
    }

    .follow-up-item .icon {
      width: 16px;
      height: 16px;
      color: #f39c12;
    }

    .completed {
      text-decoration: line-through;
      color: #95a5a6;
    }

    .completed-icon {
      width: 16px;
      height: 16px;
      color: #2ecc71;
      margin-left: 5px;
    }












    /* ====== FILTER SECTION ONLY STYLING ====== */

/* Filters Section */
.filters-section {
  flex: 1;
  min-width: 600px;
}

/* ====== SEARCH CONTAINER ====== */
.search-container {
  margin-bottom: 24px;
}

.search-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-group:hover {
  border-color: #cbd5e1;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.search-group:focus-within {
  border-color: #4a6cf7;
  box-shadow: 
    0 0 0 3px rgba(74, 108, 247, 0.1),
    0 6px 20px rgba(74, 108, 247, 0.1);
  transform: translateY(-2px);
}

/* Search Icon */
.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  transition: color 0.3s ease;
  z-index: 2;
}

.search-group:focus-within .search-icon {
  color: #4a6cf7;
}

/* Search Input */
.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.search-input:focus::placeholder {
  opacity: 0.6;
}

/* Clear Search Button */
.clear-search-btn {
  position: absolute;
  right: 12px;
  background: #fee2e2;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #ef4444;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  background: #fecaca;
  transform: scale(1.05);
}

/* ====== FILTER PILLS CONTAINER ====== */
.filter-pills-container {
  margin-bottom: 20px;
}

.filter-pills {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

/* Filter Pills */
.filter-pill {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-width: 200px;
}

.filter-pill:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.filter-pill:focus-within {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Filter Pill Header */
.filter-pill-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 8px 16px;
}

.filter-pill-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4a6cf7;
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 6px rgba(74, 108, 247, 0.3);
}

.filter-pill-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Filter Select */
.filter-pill-select {
  width: 100%;
  background: transparent;
  border: none;
  padding: 8px 16px 12px 41px;
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234a6cf7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 36px;
}

.filter-pill-select:focus {
  color: #4a6cf7;
  font-weight: 600;
}

/* ====== ACTIVE FILTERS ====== */
.active-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.active-filters-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.active-filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.active-filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #4a6cf7;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(74, 108, 247, 0.3);
  animation: slideIn 0.3s ease;
}

.active-filter-tag button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.active-filter-tag button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.clear-all-filters-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.clear-all-filters-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ====== RESULTS SUMMARY ====== */
.results-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
}

.results-count {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

/* ====== ANIMATIONS ====== */
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ====== RESPONSIVE DESIGN FOR FILTERS ====== */
@media (max-width: 1024px) {
  .filters-section {
    min-width: 500px;
  }

  .filter-pills {
    gap: 12px;
  }

  .filter-pill {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .filters-section {
    min-width: 0;
  }

  .filter-pills {
    flex-direction: column;
    gap: 12px;
  }

  .filter-pill {
    min-width: 0;
  }

  .active-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .active-filter-tags {
    width: 100%;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

@media (max-width: 480px) {
  .search-group {
    border-radius: 8px;
  }

  .search-input {
    padding: 14px 16px 14px 46px;
    font-size: 15px;
  }

  .search-icon {
    left: 14px;
  }

  .filter-pill {
    border-radius: 12px;
  }

  .filter-pill-header {
    padding: 10px 14px 6px 14px;
  }

  .filter-pill-select {
    padding: 6px 14px 10px 36px;
    font-size: 14px;
  }

  .active-filters {
    padding: 12px 16px;
  }

  .results-summary {
    padding: 10px 16px;
  }
}

/* ====== FOCUS AND ACCESSIBILITY FOR FILTERS ====== */
.filter-pill:focus-within,
.search-group:focus-within {
  outline: 2px solid #4a6cf7;
  outline-offset: 2px;
}
  `;
  document.head.appendChild(styleElement);
  
  return () => {
    document.head.removeChild(styleElement);
  };
};