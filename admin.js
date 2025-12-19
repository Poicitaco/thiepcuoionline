// Admin Panel JavaScript
const ADMIN_PASSWORD = 'wedding2025'; // Change this!

// ============================================
// LOGIN / LOGOUT
// ============================================
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    if (password === localStorage.getItem('adminPassword') || password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Mật khẩu không đúng!');
    }
});

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadDashboard();
}

// Check if already logged in
if (localStorage.getItem('adminLoggedIn') === 'true') {
    showDashboard();
}

// ============================================
// LOAD DASHBOARD DATA
// ============================================
function loadDashboard() {
    loadStats();
    loadWishes();
    loadRSVP();
}

function loadStats() {
    const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    const hearts = parseInt(localStorage.getItem('heartCount') || '0');
    
    const totalGuests = rsvpList.reduce((sum, rsvp) => {
        if (rsvp.attending) {
            const guestCount = parseInt(rsvp.guests.replace(/[^\d]/g, '')) || 1;
            return sum + guestCount;
        }
        return sum;
    }, 0);
    
    document.getElementById('total-wishes').textContent = wishes.length;
    document.getElementById('total-rsvp').textContent = rsvpList.filter(r => r.attending).length;
    document.getElementById('total-hearts').textContent = hearts;
    document.getElementById('total-guests').textContent = totalGuests;
}

// ============================================
// WISHES MANAGEMENT
// ============================================
function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
    const wishesContainer = document.getElementById('wishes-list');
    
    if (wishes.length === 0) {
        wishesContainer.innerHTML = `
            <div class="p-12 text-center text-gray-400">
                <span class="material-symbols-outlined text-6xl mb-4">mail</span>
                <p>Chưa có lời chúc nào</p>
            </div>
        `;
        return;
    }
    
    wishesContainer.innerHTML = wishes.reverse().map((wish, index) => `
        <div class="p-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                            ${wish.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">${wish.name}</h4>
                            <p class="text-xs text-gray-400">${new Date(wish.timestamp).toLocaleString('vi-VN')}</p>
                        </div>
                    </div>
                    <p class="text-gray-600 ml-13">${wish.message}</p>
                </div>
                <button onclick="deleteWish(${wishes.length - 1 - index})" class="text-gray-400 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteWish(index) {
    if (confirm('Xóa lời chúc này?')) {
        const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
        wishes.splice(wishes.length - 1 - index, 1);
        localStorage.setItem('wishes', JSON.stringify(wishes));
        loadDashboard();
    }
}

// ============================================
// RSVP MANAGEMENT
// ============================================
function loadRSVP() {
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    const rsvpContainer = document.getElementById('rsvp-list');
    
    if (rsvpList.length === 0) {
        rsvpContainer.innerHTML = `
            <tr>
                <td colspan="4" class="p-12 text-center text-gray-400">
                    Chưa có xác nhận tham dự
                </td>
            </tr>
        `;
        return;
    }
    
    rsvpContainer.innerHTML = rsvpList.reverse().map((rsvp) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4">
                <div class="font-medium text-gray-800">${rsvp.name}</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                    rsvp.attending 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }">
                    ${rsvp.attending ? '✓ Tham dự' : '✗ Không tham dự'}
                </span>
            </td>
            <td class="px-6 py-4 text-gray-600">${rsvp.guests}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">${new Date(rsvp.timestamp).toLocaleString('vi-VN')}</td>
        </tr>
    `).join('');
}

// ============================================
// TAB SWITCHING
// ============================================
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-rose-500', 'text-rose-500');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    // Add active class to clicked button
    event.target.classList.add('active', 'border-rose-500', 'text-rose-500');
    event.target.classList.remove('border-transparent', 'text-gray-500');
}

// ============================================
// SETTINGS
// ============================================
document.getElementById('change-password-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    
    if (newPassword.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    alert('Đổi mật khẩu thành công!');
    document.getElementById('new-password').value = '';
});

// ============================================
// EXPORT DATA
// ============================================
function exportData() {
    const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
    const rsvpList = JSON.parse(localStorage.getItem('rsvpList') || '[]');
    
    let csv = 'DANH SÁCH LỜI CHÚC\n\n';
    csv += 'Tên,Lời chúc,Thời gian\n';
    wishes.forEach(wish => {
        csv += `"${wish.name}","${wish.message}","${new Date(wish.timestamp).toLocaleString('vi-VN')}"\n`;
    });
    
    csv += '\n\nDANH SÁCH XÁC NHẬN THAM DỰ\n\n';
    csv += 'Tên,Trạng thái,Số người,Thời gian\n';
    rsvpList.forEach(rsvp => {
        csv += `"${rsvp.name}","${rsvp.attending ? 'Tham dự' : 'Không tham dự'}","${rsvp.guests}","${new Date(rsvp.timestamp).toLocaleString('vi-VN')}"\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// ============================================
// CLEAR ALL DATA
// ============================================
function clearAllData() {
    if (confirm('⚠️ BẠN CHẮC CHẮN MUỐN XÓA TẤT CẢ DỮ LIỆU?\n\nHành động này không thể hoàn tác!')) {
        if (confirm('Xác nhận lần cuối! Xóa tất cả?')) {
            localStorage.removeItem('wishes');
            localStorage.removeItem('rsvpList');
            localStorage.setItem('heartCount', '0');
            alert('Đã xóa tất cả dữ liệu!');
            loadDashboard();
        }
    }
}

// Auto refresh every 30 seconds
setInterval(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loadDashboard();
    }
}, 30000);

// ============================================
// CUSTOMIZATION FORMS
// ============================================
// Load existing custom data
function loadCustomData() {
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    
    // Couple info
    if (customData.groomName) document.getElementById('edit-groom-name').value = customData.groomName;
    if (customData.brideName) document.getElementById('edit-bride-name').value = customData.brideName;
    
    // Event info
    if (customData.weddingDate) document.getElementById('edit-wedding-date').value = customData.weddingDate;
    if (customData.weddingTime) document.getElementById('edit-wedding-time').value = customData.weddingTime;
    if (customData.venue) document.getElementById('edit-venue').value = customData.venue;
    
    // Bank info
    if (customData.groomBank) document.getElementById('edit-groom-bank').value = customData.groomBank;
    if (customData.groomAccount) document.getElementById('edit-groom-account').value = customData.groomAccount;
    if (customData.groomAccountName) document.getElementById('edit-groom-account-name').value = customData.groomAccountName;
    if (customData.brideBank) document.getElementById('edit-bride-bank').value = customData.brideBank;
    if (customData.brideAccount) document.getElementById('edit-bride-account').value = customData.brideAccount;
    if (customData.brideAccountName) document.getElementById('edit-bride-account-name').value = customData.brideAccountName;
}

// Save couple info
document.getElementById('couple-info-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    
    customData.groomName = document.getElementById('edit-groom-name').value;
    customData.brideName = document.getElementById('edit-bride-name').value;
    
    localStorage.setItem('wedding_custom_data', JSON.stringify(customData));
    alert('✅ Đã lưu thông tin cô dâu chú rể!');
});

// Save event info
document.getElementById('event-info-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    
    customData.weddingDate = document.getElementById('edit-wedding-date').value;
    customData.weddingTime = document.getElementById('edit-wedding-time').value;
    customData.venue = document.getElementById('edit-venue').value;
    
    localStorage.setItem('wedding_custom_data', JSON.stringify(customData));
    alert('✅ Đã lưu thông tin sự kiện!');
});

// Save bank info
document.getElementById('bank-info-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    
    customData.groomBank = document.getElementById('edit-groom-bank').value;
    customData.groomAccount = document.getElementById('edit-groom-account').value;
    customData.groomAccountName = document.getElementById('edit-groom-account-name').value;
    customData.brideBank = document.getElementById('edit-bride-bank').value;
    customData.brideAccount = document.getElementById('edit-bride-account').value;
    customData.brideAccountName = document.getElementById('edit-bride-account-name').value;
    
    localStorage.setItem('wedding_custom_data', JSON.stringify(customData));
    alert('✅ Đã lưu thông tin ngân hàng!');
});

// ============================================
// IMAGE UPLOAD HANDLERS
// ============================================
function setupImageUpload(inputId, previewId, storageKey) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            
            // Show preview
            preview.innerHTML = `<img src="${imageData}" class="w-full h-full object-cover">`;
            preview.classList.remove('hidden');
            
            // Save to localStorage
            const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
            customData[storageKey] = imageData;
            localStorage.setItem('wedding_custom_data', JSON.stringify(customData));
            
            alert('✅ Ảnh đã được lưu! Làm mới trang chính để xem thay đổi.');
        };
        reader.readAsDataURL(file);
    });
}

// Setup all image uploads
function initImageUploads() {
    setupImageUpload('upload-hero-bg', 'preview-hero-bg', 'heroBgImage');
    
    for (let i = 1; i <= 6; i++) {
        setupImageUpload(`upload-gallery-${i}`, `preview-gallery-${i}`, `galleryImage${i}`);
    }
    
    // Load existing images
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    if (customData.heroBgImage) {
        document.getElementById('preview-hero-bg').innerHTML = `<img src="${customData.heroBgImage}" class="w-full h-full object-cover">`;
    }
    
    for (let i = 1; i <= 6; i++) {
        if (customData[`galleryImage${i}`]) {
            const preview = document.getElementById(`preview-gallery-${i}`);
            preview.innerHTML = `<img src="${customData[`galleryImage${i}`]}" class="w-full h-full object-cover">`;
            preview.classList.remove('hidden');
        }
    }
}

function saveGalleryImages() {
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    customData.galleryImages = [];
    
    for (let i = 1; i <= 6; i++) {
        if (customData[`galleryImage${i}`]) {
            customData.galleryImages.push(customData[`galleryImage${i}`]);
        }
    }
    
    localStorage.setItem('wedding_custom_data', JSON.stringify(customData));
    alert('✅ Album ảnh đã được lưu!');
}

// ============================================
// INVITATION LINK GENERATOR
// ============================================
document.getElementById('invitation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('guest-title-select').value;
    const name = document.getElementById('guest-name-input').value.trim();
    
    if (!name) {
        alert('Vui lòng nhập tên khách mời!');
        return;
    }
    
    // Get current website URL (for production, use your actual domain)
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    const invitationLink = `${baseUrl}?name=${encodeURIComponent(name)}&title=${encodeURIComponent(title)}`;
    
    // Show result
    document.getElementById('generated-link').value = invitationLink;
    document.getElementById('preview-greeting').textContent = `${title} ${name}`;
    document.getElementById('invitation-link-result').classList.remove('hidden');
    
    // Save to list
    const invitations = JSON.parse(localStorage.getItem('wedding_invitations') || '[]');
    invitations.push({ title, name, link: invitationLink, created: new Date().toISOString() });
    localStorage.setItem('wedding_invitations', JSON.stringify(invitations));
    
    // Reload list
    loadInvitationLinks();
    
    // Clear form
    document.getElementById('guest-name-input').value = '';
});

function copyInvitationLink() {
    const link = document.getElementById('generated-link').value;
    navigator.clipboard.writeText(link).then(() => {
        alert('✅ Đã copy link thiệp mời!');
    });
}

function loadInvitationLinks() {
    const invitations = JSON.parse(localStorage.getItem('wedding_invitations') || '[]');
    const container = document.getElementById('invitation-links-list');
    
    if (invitations.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-sm">Chưa có link nào được tạo.</p>';
        return;
    }
    
    container.innerHTML = invitations.reverse().map((inv, index) => `
        <div class="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <div class="flex-1">
                <p class="font-semibold text-sm">${inv.title} ${inv.name}</p>
                <p class="text-xs text-gray-500 truncate">${inv.link}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="navigator.clipboard.writeText('${inv.link}').then(() => alert('Đã copy!'))" class="text-blue-500 hover:bg-blue-50 p-2 rounded">
                    <span class="material-symbols-outlined text-sm">content_copy</span>
                </button>
                <button onclick="deleteInvitation(${index})" class="text-red-500 hover:bg-red-50 p-2 rounded">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteInvitation(index) {
    const invitations = JSON.parse(localStorage.getItem('wedding_invitations') || '[]');
    invitations.splice(invitations.length - 1 - index, 1);
    localStorage.setItem('wedding_invitations', JSON.stringify(invitations));
    loadInvitationLinks();
}

// Initialize when dashboard is shown
const originalShowDashboard = showDashboard;
function showDashboard() {
    originalShowDashboard();
    loadCustomData();
    initImageUploads();
    loadInvitationLinks();
}
