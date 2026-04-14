/**
 * Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('portal_username');
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    
    // 1. Dynamic Greeting & Profile update
    if (username) {
        const welcomeTitle = document.getElementById('welcome-title');
        const profileName = document.getElementById('profile-name');
        const profileAvatar = document.getElementById('profile-avatar');

        if (welcomeTitle) welcomeTitle.textContent = `Back to your strings, ${username.split(' ')[0]}?`;
        if (profileName) profileName.textContent = username;
        
        if (profileAvatar) {
            const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            profileAvatar.textContent = initials;
        }
    }

    // 2. Admin Dashboard dynamic population
    const studentTableBody = document.getElementById('student-table-body');
    if (studentTableBody) {
        populateAdminTable(students);
        updateAdminStats(students);
    }
});

function populateAdminTable(students) {
    const tableBody = document.getElementById('student-table-body');
    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No students registered yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = students.map(student => {
        const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="avatar-sm">${initials}</div>
                        ${student.name}
                    </div>
                </td>
                <td>${student.dob || 'N/A'}</td>
                <td>${student.email || 'N/A'}</td>
                <td><span style="text-transform: capitalize;">${student.gender || 'N/A'}</span></td>
                <td>${student.country || 'N/A'}</td>
                <td>${student.whatsapp}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="openEditModal('${student.whatsapp}')" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" onclick="deleteStudent('${student.whatsapp}')" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function deleteStudent(whatsapp) {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
        const updatedStudents = students.filter(s => s.whatsapp !== whatsapp);
        
        localStorage.setItem('registered_students', JSON.stringify(updatedStudents));
        location.reload(); // Refresh to update table and stats
    }
}

function openEditModal(whatsapp) {
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    const student = students.find(s => s.whatsapp === whatsapp);
    
    if (student) {
        document.getElementById('edit-original-whatsapp').value = student.whatsapp;
        document.getElementById('edit-name').value = student.name || '';
        document.getElementById('edit-dob').value = student.dob || '';
        document.getElementById('edit-email').value = student.email || '';
        document.getElementById('edit-gender').value = student.gender || '';
        document.getElementById('edit-country').value = student.country || '';
        document.getElementById('edit-whatsapp').value = student.whatsapp || '';
        
        document.getElementById('edit-modal').classList.add('active');
    }
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function saveStudentEdit(event) {
    event.preventDefault();
    const originalWhatsapp = document.getElementById('edit-original-whatsapp').value;
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    
    const index = students.findIndex(s => s.whatsapp === originalWhatsapp);
    if (index !== -1) {
        students[index] = {
            ...students[index],
            name: document.getElementById('edit-name').value,
            dob: document.getElementById('edit-dob').value,
            email: document.getElementById('edit-email').value,
            gender: document.getElementById('edit-gender').value,
            country: document.getElementById('edit-country').value,
            whatsapp: document.getElementById('edit-whatsapp').value
        };
        
        localStorage.setItem('registered_students', JSON.stringify(students));
        closeModal();
        location.reload(); // Refresh to show changes
    }
}

function updateAdminStats(students) {
    const guitarCount = document.getElementById('guitar-count');
    const ukeleleCount = document.getElementById('ukelele-count');
    
    if (guitarCount) guitarCount.textContent = students.length; // Placeholder logic
}

function logout() {
    sessionStorage.removeItem('portal_username');
    window.location.href = 'index.html';
}

function exportDB() {
    const students = localStorage.getItem('registered_students') || '[]';
    const blob = new Blob([students], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_database.json';
    a.click();
    URL.revokeObjectURL(url);
}

window.logout = logout;
window.exportDB = exportDB;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.saveStudentEdit = saveStudentEdit;
window.deleteStudent = deleteStudent;

function openAdminModal() {
    const adminData = JSON.parse(localStorage.getItem('admin_details') || '{"name":"Administrator","username":"admin","dob":""}');
    document.getElementById('admin-display-name').value = adminData.name;
    document.getElementById('admin-display-user').value = adminData.username || 'admin';
    document.getElementById('admin-display-dob').value = adminData.dob || '';
    document.getElementById('admin-pass-modal').classList.add('active');
}

function closeAdminModal() {
    document.getElementById('admin-pass-modal').classList.remove('active');
}

function saveAdminSettings(event) {
    event.preventDefault();
    const name = document.getElementById('admin-display-name').value;
    const username = document.getElementById('admin-display-user').value;
    const dob = document.getElementById('admin-display-dob').value;
    const pass = document.getElementById('new-admin-pass').value;

    const adminDetails = { name, username, dob };
    localStorage.setItem('admin_details', JSON.stringify(adminDetails));
    localStorage.setItem('admin_username', username);
    
    if (pass) {
        localStorage.setItem('admin_password', pass);
    }

    alert('Admin account settings updated successfully!');
    location.reload(); // Refresh to update header and clear password field
}

// Populate Admin Header on Load
document.addEventListener('DOMContentLoaded', () => {
    const adminHeaderName = document.getElementById('admin-header-name');
    if (adminHeaderName) {
        const adminData = JSON.parse(localStorage.getItem('admin_details') || '{"name":"Administrator","username":"admin","dob":""}');
        adminHeaderName.textContent = adminData.name;
        document.getElementById('admin-header-role').textContent = "@" + (adminData.username || 'admin');
    }
});

window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.saveAdminSettings = saveAdminSettings;

function searchAdminStudents() {
    const query = document.getElementById('admin-search-students').value.toLowerCase();
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    const filteredStudents = students.filter(student => 
        (student.name && student.name.toLowerCase().includes(query)) || 
        (student.email && student.email.toLowerCase().includes(query)) ||
        (student.whatsapp && student.whatsapp.includes(query)) ||
        (student.country && student.country.toLowerCase().includes(query))
    );
    populateAdminTable(filteredStudents);
}

window.searchAdminStudents = searchAdminStudents;
