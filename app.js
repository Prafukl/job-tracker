// Updated app.js with debugging and fixes

let currentUser = null;
let editingJobId = null;

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User authenticated:', user.email);
        currentUser = user;
        document.getElementById('userEmail').textContent = user.email;
        loadJobs();
        checkForReminders();
    } else {
        console.log('No user signed in');
        window.location.href = 'login.html';
    }
});

// Logout function
async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Job Modal functions
function showAddJobModal() {
    editingJobId = null;
    document.getElementById('modalTitle').textContent = 'Add New Application';
    document.getElementById('jobForm').reset();
    
    // Set today's date as default for application date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('applicationDate').value = today;
    
    // Set default follow-up date to 7 days from today
    const defaultFollowUpDate = new Date();
    defaultFollowUpDate.setDate(defaultFollowUpDate.getDate() + 7);
    document.getElementById('followUpDate').value = defaultFollowUpDate.toISOString().split('T')[0];
    
    document.getElementById('jobModal').style.display = 'flex';
}

function closeJobModal() {
    document.getElementById('jobModal').style.display = 'none';
    document.getElementById('jobForm').reset();
    editingJobId = null;
}

// Edit job function
async function editJob(jobId) {
    editingJobId = jobId;
    document.getElementById('modalTitle').textContent = 'Edit Application';
    
    try {
        const doc = await db.collection('jobs').doc(jobId).get();
        const job = doc.data();
        
        document.getElementById('jobId').value = jobId;
        document.getElementById('jobTitle').value = job.title;
        document.getElementById('companyName').value = job.company;
        document.getElementById('jobSource').value = job.source;
        document.getElementById('applicationDate').value = job.applicationDate;
        document.getElementById('jobStatus').value = job.status;
        document.getElementById('jobDescription').value = job.description || '';
        document.getElementById('notes').value = job.notes || '';
        document.getElementById('followUpDate').value = job.followUpDate || '';
        document.getElementById('followUpCompleted').checked = job.followUpCompleted || false;
        
        document.getElementById('jobModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading job:', error);
    }
}

// Delete job function
async function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this application?')) {
        try {
            await db.collection('jobs').doc(jobId).delete();
            console.log('Job deleted successfully');
            loadJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    }
}

// Mark follow-up as complete
async function toggleFollowUp(jobId) {
    try {
        const doc = await db.collection('jobs').doc(jobId).get();
        const job = doc.data();
        await db.collection('jobs').doc(jobId).update({
            followUpCompleted: !job.followUpCompleted,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadJobs();
    } catch (error) {
        console.error('Error updating follow-up status:', error);
    }
}

// Handle job form submission
document.getElementById('jobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    // Validate required fields
    const title = document.getElementById('jobTitle').value;
    const company = document.getElementById('companyName').value;
    const source = document.getElementById('jobSource').value;
    const applicationDate = document.getElementById('applicationDate').value;
    const status = document.getElementById('jobStatus').value;
    
    if (!title || !company || !source || !applicationDate || !status) {
        alert('Please fill all required fields');
        return;
    }
    
    const jobData = {
        title: title,
        company: company,
        source: source,
        applicationDate: applicationDate,
        status: status,
        description: document.getElementById('jobDescription').value,
        notes: document.getElementById('notes').value,
        followUpDate: document.getElementById('followUpDate').value,
        followUpCompleted: document.getElementById('followUpCompleted').checked,
        userId: currentUser.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    console.log('Job data:', jobData);
    
    try {
        if (editingJobId) {
            console.log('Updating job:', editingJobId);
            await db.collection('jobs').doc(editingJobId).update(jobData);
            console.log('Job updated successfully');
        } else {
            console.log('Creating new job');
            jobData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection('jobs').add(jobData);
            console.log('Job created with ID:', docRef.id);
        }
        
        closeJobModal();
        loadJobs();
    } catch (error) {
        console.error('Error saving job:', error);
        alert('Error saving job: ' + error.message);
    }
});

// Create reminder banner
function displayReminderBanner(reminders) {
    const existingBanner = document.getElementById('reminderBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    if (reminders.length > 0) {
        const banner = document.createElement('div');
        banner.id = 'reminderBanner';
        banner.className = 'reminder-banner';
        banner.innerHTML = `
            <div class="reminder-content">
                <span class="reminder-icon">🔔</span>
                <span>You have ${reminders.length} applications to follow up on!</span>
                <button class="view-reminders-btn" onclick="filterByReminders()">View Reminders</button>
            </div>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(banner, container.firstChild.nextSibling);
    }
}

// Filter jobs to show only those with pending reminders
function filterByReminders() {
    const jobItems = document.querySelectorAll('.job-item');
    let hasReminders = false;
    
    jobItems.forEach(item => {
        const followUpBadge = item.querySelector('.follow-up-pending');
        if (followUpBadge) {
            item.style.display = 'block';
            hasReminders = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Add a "Show All" button if filtering
    if (hasReminders) {
        const existingShowAllBtn = document.querySelector('.show-all-btn');
        if (!existingShowAllBtn) {
            const showAllBtn = document.createElement('button');
            showAllBtn.textContent = 'Show All Applications';
            showAllBtn.className = 'show-all-btn';
            showAllBtn.onclick = () => {
                jobItems.forEach(item => item.style.display = 'block');
                showAllBtn.remove();
            };
            document.querySelector('.job-list').insertBefore(showAllBtn, document.querySelector('.job-list').firstChild);
        }
    }
}

// Create job element
function createJobElement(jobId, job) {
    const div = document.createElement('div');
    div.className = 'job-item';
    
    const statusClass = `status-${job.status.toLowerCase()}`;
    const today = new Date().toISOString().split('T')[0];
    const isPendingFollowUp = job.followUpDate && !job.followUpCompleted && job.followUpDate <= today;
    const isUpcomingFollowUp = job.followUpDate && !job.followUpCompleted && job.followUpDate > today;
    
    div.innerHTML = `
        <div class="job-header">
            <div>
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}</div>
                <span class="job-source">${job.source}</span>
                <span class="job-status ${statusClass}">${job.status}</span>
                ${isPendingFollowUp ? '<span class="follow-up-pending">Follow-up Due!</span>' : ''}
                ${isUpcomingFollowUp ? `<span class="follow-up-upcoming">Follow-up: ${new Date(job.followUpDate).toLocaleDateString()}</span>` : ''}
                ${job.followUpCompleted ? '<span class="follow-up-completed">✓ Followed up</span>' : ''}
            </div>
            <div class="job-actions">
                ${job.followUpDate && !job.followUpCompleted ? `<button class="icon-btn" onclick="toggleFollowUp('${jobId}')" title="Mark as followed up">✓</button>` : ''}
                <button class="icon-btn" onclick="editJob('${jobId}')" title="Edit">✏️</button>
                <button class="icon-btn" onclick="deleteJob('${jobId}')" title="Delete">🗑️</button>
            </div>
        </div>
        <div style="margin-top: 10px; color: #666;">
            Applied on: ${new Date(job.applicationDate).toLocaleDateString()}
        </div>
        ${job.notes ? `<div style="margin-top: 10px; color: #666;">Notes: ${job.notes}</div>` : ''}
    `;
    
    return div;
}

// Check for reminders on page load
function checkForReminders() {
    // This will be called when the page loads to ensure reminders are shown
    loadJobs();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('jobModal')) {
        closeJobModal();
    }
}

// Test function to create a simple job
async function testSaveJob() {
    if (!currentUser) {
        console.error('No user logged in');
        return;
    }
    
    try {
        const testJob = {
            title: 'Test Job',
            company: 'Test Company',
            source: 'LinkedIn',
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'Applied',
            userId: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('Creating test job:', testJob);
        const docRef = await db.collection('jobs').add(testJob);
        console.log('Test job created with ID:', docRef.id);
        loadJobs();
    } catch (error) {
        console.error('Test save error:', error);
    }
}

// Updated calculateStats function with proper date extraction
function calculateStats() {
    const stats = {
        total: 0,
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0
    };
    
    const sourceCount = {};
    const monthlyCount = {};
    let totalResponseTime = 0;
    let responseCount = 0;
    let applicationDates = [];
    
    document.querySelectorAll('.job-item').forEach(item => {
        stats.total++;
        
        // Get status
        const statusElement = item.querySelector('.job-status');
        const status = statusElement.textContent.toLowerCase();
        if (stats[status] !== undefined) {
            stats[status]++;
        }
        
        // Get source
        const sourceElement = item.querySelector('.job-source');
        const source = sourceElement.textContent;
        sourceCount[source] = (sourceCount[source] || 0) + 1;
        
        // Get application date - look for the date text
        const dateElements = item.querySelectorAll('div');
        let applicationDate = null;
        
        dateElements.forEach(element => {
            const text = element.textContent;
            if (text.includes('Applied on:')) {
                const dateMatch = text.match(/Applied on: (.+)/);
                if (dateMatch) {
                    applicationDate = new Date(dateMatch[1]);
                    applicationDates.push(applicationDate);
                }
            }
        });
        
        if (applicationDate) {
            // Monthly count
            const monthKey = `${applicationDate.getFullYear()}-${String(applicationDate.getMonth() + 1).padStart(2, '0')}`;
            monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
            
            // Calculate response time for non-pending applications
            if (status === 'interview' || status === 'offer') {
                const daysDiff = Math.floor((new Date() - applicationDate) / (1000 * 60 * 60 * 24));
                totalResponseTime += daysDiff;
                responseCount++;
            }
        }
    });
    
    // Update basic stats
    document.getElementById('totalApplications').textContent = stats.total;
    document.getElementById('pendingApplications').textContent = stats.applied;
    document.getElementById('interviewCount').textContent = stats.interview;
    document.getElementById('offerCount').textContent = stats.offer;
    
    // Calculate and update rates
    const responseRate = stats.total > 0 ? 
        Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
    document.getElementById('responseRate').textContent = responseRate + '%';
    
    const rejectionRate = stats.total > 0 ? 
        Math.round((stats.rejected / stats.total) * 100) : 0;
    document.getElementById('rejectionRate').textContent = rejectionRate + '%';
    
    // Find most active source
    let topSource = '-';
    let maxCount = 0;
    for (const [source, count] of Object.entries(sourceCount)) {
        if (count > maxCount) {
            maxCount = count;
            topSource = source;
        }
    }
    document.getElementById('topSource').textContent = topSource;
    
    // Calculate average response time
    const avgResponseTime = responseCount > 0 ? 
        Math.round(totalResponseTime / responseCount) : 0;
    document.getElementById('avgResponseTime').textContent = 
        avgResponseTime > 0 ? `${avgResponseTime} days` : '-';
    
    // Get current month applications
    const currentMonth = new Date();
    const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('monthlyApplications').textContent = 
        monthlyCount[currentMonthKey] || 0;
    
    console.log('Stats calculated:', {
        stats,
        sourceCount,
        monthlyCount,
        currentMonthKey,
        applicationDates: applicationDates.length
    });
}

// Alternative approach: Update calculateStats to work with the data from Firebase directly
async function calculateStatsFromFirebase() {
    if (!currentUser) return;
    
    try {
        const snapshot = await db.collection('jobs')
            .where('userId', '==', currentUser.uid)
            .get();
        
        const stats = {
            total: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0
        };
        
        const sourceCount = {};
        let totalResponseTime = 0;
        let responseCount = 0;
        const monthlyCount = {};
        
        snapshot.forEach(doc => {
            const job = doc.data();
            stats.total++;
            
            // Count by status
            const status = job.status.toLowerCase();
            if (stats[status] !== undefined) {
                stats[status]++;
            }
            
            // Count by source
            sourceCount[job.source] = (sourceCount[job.source] || 0) + 1;
            
            // Process dates
            if (job.applicationDate) {
                const appDate = new Date(job.applicationDate);
                const monthKey = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}`;
                monthlyCount[monthKey] = (monthlyCount[monthKey] || 0) + 1;
                
                // Calculate response time
                if (status === 'interview' || status === 'offer') {
                    const daysDiff = Math.floor((new Date() - appDate) / (1000 * 60 * 60 * 24));
                    totalResponseTime += daysDiff;
                    responseCount++;
                }
            }
        });
        
        // Update UI
        document.getElementById('totalApplications').textContent = stats.total;
        document.getElementById('pendingApplications').textContent = stats.applied;
        document.getElementById('interviewCount').textContent = stats.interview;
        document.getElementById('offerCount').textContent = stats.offer;
        
        // Response rate
        const responseRate = stats.total > 0 ? 
            Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
        document.getElementById('responseRate').textContent = responseRate + '%';
        
        // Rejection rate
        const rejectionRate = stats.total > 0 ? 
            Math.round((stats.rejected / stats.total) * 100) : 0;
        document.getElementById('rejectionRate').textContent = rejectionRate + '%';
        
        // Most active source
        let topSource = '-';
        let maxCount = 0;
        for (const [source, count] of Object.entries(sourceCount)) {
            if (count > maxCount) {
                maxCount = count;
                topSource = source;
            }
        }
        document.getElementById('topSource').textContent = topSource;
        
        // Average response time
        const avgResponseTime = responseCount > 0 ? 
            Math.round(totalResponseTime / responseCount) : 0;
        document.getElementById('avgResponseTime').textContent = 
            avgResponseTime > 0 ? `${avgResponseTime} days` : '-';
        
        // Current month applications
        const currentMonth = new Date();
        const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById('monthlyApplications').textContent = 
            monthlyCount[currentMonthKey] || 0;
            
    } catch (error) {
        console.error('Error calculating stats:', error);
    }
}

// Load jobs from Firestore
async function loadJobs() {
    console.log('Loading jobs...');
    console.log('Current user ID:', currentUser?.uid);
    
    if (!currentUser) {
        console.error('No current user');
        return;
    }
    
    try {
        const snapshot = await db.collection('jobs')
            .where('userId', '==', currentUser.uid)
            .orderBy('applicationDate', 'desc')
            .get();
        
        console.log('Jobs found:', snapshot.size);
        
        const jobList = document.getElementById('jobList');
        jobList.innerHTML = '';
        
        let upcomingReminders = [];
        const today = new Date().toISOString().split('T')[0];
        
        snapshot.forEach(doc => {
            const job = doc.data();
            
            if (job.followUpDate && !job.followUpCompleted && job.followUpDate <= today) {
                upcomingReminders.push({ id: doc.id, job });
            }
            
            const jobElement = createJobElement(doc.id, job);
            jobList.appendChild(jobElement);
        });
        
        displayReminderBanner(upcomingReminders);
        
        if (snapshot.empty) {
            jobList.innerHTML = '<p style="text-align: center; color: #666;">No job applications yet. Click "Add New Application" to get started!</p>';
        }
        
        // Use the Firebase-based stats calculation
        calculateStatsFromFirebase();
        
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

// Toggle Analytics Dashboard
function toggleAnalytics() {
    const analyticsSection = document.getElementById('analyticsSection');
    const toggleBtn = document.querySelector('.toggle-analytics');
    
    if (!analyticsSection) return;
    
    if (analyticsSection.style.display === 'none' || !analyticsSection.style.display) {
        analyticsSection.style.display = 'block';
        toggleBtn.textContent = 'Hide Analytics';
        analyticsSection.dataset.userToggled = 'true';
        // Recalculate stats when showing
        calculateStatsFromFirebase();
    } else {
        analyticsSection.style.display = 'none';
        toggleBtn.textContent = 'Show Analytics';
        analyticsSection.dataset.userToggled = 'true';
    }
}

// Initialize analytics visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    const analyticsSection = document.getElementById('analyticsSection');
    const toggleBtn = document.querySelector('.toggle-analytics');
    
    if (analyticsSection && toggleBtn) {
        // Set initial state based on screen size
        if (window.innerWidth <= 768) {
            // Hide on mobile by default
            analyticsSection.style.display = 'none';
            toggleBtn.textContent = 'Show Analytics';
        } else {
            // Show on desktop by default
            analyticsSection.style.display = 'block';
            toggleBtn.textContent = 'Hide Analytics';
        }
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const analyticsSection = document.getElementById('analyticsSection');
        const toggleBtn = document.querySelector('.toggle-analytics');
        
        if (analyticsSection && toggleBtn) {
            // Only reset if user hasn't manually toggled
            if (!analyticsSection.dataset.userToggled) {
                if (window.innerWidth <= 768) {
                    analyticsSection.style.display = 'none';
                    toggleBtn.textContent = 'Show Analytics';
                } else {
                    analyticsSection.style.display = 'block';
                    toggleBtn.textContent = 'Hide Analytics';
                }
            }
        }
    }, 250);
});