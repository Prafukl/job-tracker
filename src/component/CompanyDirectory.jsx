import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  Building2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Linkedin,
  Globe,
  Briefcase,
  X,
  Search,
  Filter,
  MapPin,
  Users,
  Award
} from 'lucide-react';
import { addCompanyDirectoryStyles } from './CompanyDirectoryStyles';

const CompanyDirectory = () => {
  const { currentUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('All');

  // Service types with emojis
  const serviceTypes = [
    'Software Development',
    'Web Development', 
    'Mobile App Development',
    'AI/Machine Learning',
    'Data Analytics',
    'Cloud Services',
    'Cybersecurity',
    'Digital Marketing',
    'E-commerce',
    'Fintech',
    'Healthcare Tech',
    'EdTech',
    'Gaming',
    'Blockchain',
    'IoT Solutions',
    'DevOps',
    'Consulting',
    'Startup',
    'Enterprise'
  ];

  const [formData, setFormData] = useState({
    companyName: '',
    serviceType: 'Software Development',
    linkedinUrl: '',
    careerPageUrl: '',
    website: '',
    description: '',
    location: '',
    companySize: '',
    founded: ''
  });

  const [editFormData, setEditFormData] = useState({});

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.email === 'admin@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Fetch companies from Firestore and add styles
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const companiesRef = collection(db, 'companies');
        const q = query(
          companiesRef, 
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedCompanies = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedCompanies.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date()
          });
        });
        
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
    
    // Add custom styles
    const removeStyles = addCompanyDirectoryStyles();
    
    // Cleanup
    return () => {
      if (removeStyles) removeStyles();
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new company
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !isAdmin) {
      alert('Only admin users can add companies');
      return;
    }
    
    if (!formData.companyName || !formData.serviceType) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const companyData = {
        ...formData,
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'companies'), companyData);
      
      // Add to state with client-side timestamp for immediate display
      const newCompany = {
        ...companyData,
        id: docRef.id,
        createdAt: new Date()
      };
      
      setCompanies(prev => [newCompany, ...prev]);
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        companyName: '',
        serviceType: 'Software Development',
        linkedinUrl: '',
        careerPageUrl: '',
        website: '',
        description: '',
        location: '',
        companySize: '',
        founded: ''
      });
      
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Failed to add company. Please try again.');
    }
  };

  // Start editing a company
  const startEdit = (company) => {
    setEditingCompany(company);
    setEditFormData({
      companyName: company.companyName,
      serviceType: company.serviceType,
      linkedinUrl: company.linkedinUrl || '',
      careerPageUrl: company.careerPageUrl || '',
      website: company.website || '',
      description: company.description || '',
      location: company.location || '',
      companySize: company.companySize || '',
      founded: company.founded || ''
    });
    setShowEditModal(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCompany(null);
    setEditFormData({});
    setShowEditModal(false);
  };

  // Save edited company
  const saveEdit = async () => {
    if (!editFormData.companyName || !editFormData.serviceType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const companyRef = doc(db, 'companies', editingCompany.id);
      await updateDoc(companyRef, {
        ...editFormData,
        updatedAt: serverTimestamp()
      });

      // Update in state
      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id 
          ? { 
              ...company, 
              ...editFormData,
              updatedAt: new Date()
            } 
          : company
      ));

      setEditingCompany(null);
      setEditFormData({});
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Failed to update company. Please try again.');
    }
  };

  // Delete company
  const confirmDelete = (id) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentUser || !isAdmin || !companyToDelete) return;

    try {
      await deleteDoc(doc(db, 'companies', companyToDelete));
      setCompanies(prev => prev.filter(company => company.id !== companyToDelete));
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  // Get service type emoji
  const getServiceEmoji = (serviceType) => {
    const emojiMap = {
      'Software Development': '💻',
      'Web Development': '🌐',
      'Mobile App Development': '📱',
      'AI/Machine Learning': '🤖',
      'Data Analytics': '📊',
      'Cloud Services': '☁️',
      'Cybersecurity': '🔒',
      'Digital Marketing': '📢',
      'E-commerce': '🛒',
      'Fintech': '💳',
      'Healthcare Tech': '🏥',
      'EdTech': '🎓',
      'Gaming': '🎮',
      'Blockchain': '⛓️',
      'IoT Solutions': '🌐',
      'DevOps': '⚙️',
      'Consulting': '💼',
      'Startup': '🚀',
      'Enterprise': '🏢'
    };
    return emojiMap[serviceType] || '🏢';
  };

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'All' || company.serviceType === filterService;
    return matchesSearch && matchesService;
  });

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return date instanceof Date 
      ? date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
  };

  return (
    <div className="company-directory-container">
      <div className="company-header">
        <div className="header-content">
          <h1 className="company-title">
            <Building2 size={32} />
            Company Directory
          </h1>
          <p className="company-subtitle">
            Discover amazing companies and career opportunities
          </p>
        </div>
        {isAdmin && (
          <button 
            className="add-company-button"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Add Company</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search companies, services, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>
                {getServiceEmoji(service)} {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <Building2 size={48} className="loading-icon" />
          <p>Loading companies...</p>
        </div>
      ) : (
        <>
          {filteredCompanies.length > 0 ? (
            <div className="companies-grid">
              {filteredCompanies.map(company => (
                <div key={company.id} className="company-card">
                  <div className="company-header-card">
                    <div className="company-info-header">
                      <h3 className="company-name">{company.companyName}</h3>
                      <div className="service-badge">
                        <span className="service-emoji">{getServiceEmoji(company.serviceType)}</span>
                        <span className="service-text">{company.serviceType}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="company-actions">
                        <button 
                          className="edit-company-btn"
                          onClick={() => startEdit(company)}
                          title="Edit Company"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="delete-company-btn"
                          onClick={() => confirmDelete(company.id)}
                          title="Delete Company"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {company.description && (
                    <p className="company-description">{company.description}</p>
                  )}

                  <div className="company-details">
                    {company.location && (
                      <div className="company-detail">
                        <MapPin size={16} />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.companySize && (
                      <div className="company-detail">
                        <Users size={16} />
                        <span>{company.companySize} employees</span>
                      </div>
                    )}
                    {company.founded && (
                      <div className="company-detail">
                        <Award size={16} />
                        <span>Founded {company.founded}</span>
                      </div>
                    )}
                  </div>

                  <div className="company-links">
                    {company.website && (
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="company-link website-link"
                      >
                        <Globe size={16} />
                        <span>Website</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {company.linkedinUrl && (
                      <a 
                        href={company.linkedinUrl.startsWith('http') ? company.linkedinUrl : `https://${company.linkedinUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="company-link linkedin-link"
                      >
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {company.careerPageUrl && (
                      <a 
                        href={company.careerPageUrl.startsWith('http') ? company.careerPageUrl : `https://${company.careerPageUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="company-link career-link"
                      >
                        <Briefcase size={16} />
                        <span>Careers</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <div className="company-footer">
                    <span className="added-date">Added {formatDate(company.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Building2 size={64} className="empty-icon" />
              <h2 className="empty-title">
                {searchTerm || filterService !== 'All' 
                  ? 'No companies found' 
                  : 'No companies yet'}
              </h2>
              <p className="empty-description">
                {searchTerm || filterService !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : isAdmin 
                    ? 'Add the first company to get started.'
                    : 'Companies will appear here once they are added.'}
              </p>
              {isAdmin && !searchTerm && filterService === 'All' && (
                <button 
                  className="add-company-button"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={18} />
                  <span>Add First Company</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Add New Company</h2>
              <button 
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">Company Name *</label>
                  <input 
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="form-input"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serviceType" className="form-label">Service Type *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    className="form-select"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                  >
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>
                        {getServiceEmoji(service)} {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input 
                    type="text"
                    id="location"
                    name="location"
                    className="form-input"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="companySize" className="form-label">Company Size</label>
                  <select
                    id="companySize"
                    name="companySize"
                    className="form-select"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="founded" className="form-label">Founded Year</label>
                  <input 
                    type="number"
                    id="founded"
                    name="founded"
                    className="form-input"
                    value={formData.founded}
                    onChange={handleChange}
                    placeholder="e.g. 2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input 
                    type="url"
                    id="website"
                    name="website"
                    className="form-input"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="linkedinUrl" className="form-label">LinkedIn Company Page</label>
                  <input 
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    className="form-input"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/company-name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="careerPageUrl" className="form-label">Career Page</label>
                  <input 
                    type="url"
                    id="careerPageUrl"
                    name="careerPageUrl"
                    className="form-input"
                    value={formData.careerPageUrl}
                    onChange={handleChange}
                    placeholder="https://company.com/careers"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what the company does..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="submit-button"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && editingCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Edit Company</h2>
              <button 
                className="close-button"
                onClick={cancelEdit}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-companyName" className="form-label">Company Name *</label>
                  <input 
                    type="text"
                    id="edit-companyName"
                    name="companyName"
                    className="form-input"
                    value={editFormData.companyName}
                    onChange={handleEditChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-serviceType" className="form-label">Service Type *</label>
                  <select
                    id="edit-serviceType"
                    name="serviceType"
                    className="form-select"
                    value={editFormData.serviceType}
                    onChange={handleEditChange}
                    required
                  >
                    {serviceTypes.map(service => (
                      <option key={service} value={service}>
                        {getServiceEmoji(service)} {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-location" className="form-label">Location</label>
                  <input 
                    type="text"
                    id="edit-location"
                    name="location"
                    className="form-input"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-companySize" className="form-label">Company Size</label>
                  <select
                    id="edit-companySize"
                    name="companySize"
                    className="form-select"
                    value={editFormData.companySize}
                    onChange={handleEditChange}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-founded" className="form-label">Founded Year</label>
                  <input 
                    type="number"
                    id="edit-founded"
                    name="founded"
                    className="form-input"
                    value={editFormData.founded}
                    onChange={handleEditChange}
                    placeholder="e.g. 2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-website" className="form-label">Website</label>
                  <input 
                    type="url"
                    id="edit-website"
                    name="website"
                    className="form-input"
                    value={editFormData.website}
                    onChange={handleEditChange}
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-linkedinUrl" className="form-label">LinkedIn Company Page</label>
                  <input 
                    type="url"
                    id="edit-linkedinUrl"
                    name="linkedinUrl"
                    className="form-input"
                    value={editFormData.linkedinUrl}
                    onChange={handleEditChange}
                    placeholder="https://linkedin.com/company/company-name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-careerPageUrl" className="form-label">Career Page</label>
                  <input 
                    type="url"
                    id="edit-careerPageUrl"
                    name="careerPageUrl"
                    className="form-input"
                    value={editFormData.careerPageUrl}
                    onChange={handleEditChange}
                    placeholder="https://company.com/careers"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="form-textarea"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  placeholder="Describe what the company does..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="submit-button"
                >
                  Update Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Confirm Deletion</h2>
              <button 
                className="close-button"
                onClick={cancelDelete}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-form">
              <p>Are you sure you want to delete this company? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="submit-button delete-confirm-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDirectory;