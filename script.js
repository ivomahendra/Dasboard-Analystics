// script.js - Lengkap untuk semua halaman dashboard

// ==================== GLOBAL VARIABLES ====================
let currentPage = 1;
let currentTab = 'profile';
let charts = {};

// ==================== INISIALISASI ====================
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi komponen umum
    initializeSidebar();
    initializeTheme();
    initializeCharts();
    loadData();
    initializeModals();
    initializeTabs();
    initializeEventListeners();
});

// ==================== SIDEBAR TOGGLE ====================
function initializeSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Tutup sidebar ketika klik di luar (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// ==================== THEME TOGGLE ====================
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    
    // Cek tema tersimpan
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==================== NAVIGASI ====================
function navigateTo(page) {
    window.location.href = page;
}

function goToHome() {
    window.location.href = 'index.html';
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Hapus session/token jika ada
        localStorage.removeItem('token');
        // Redirect ke halaman login (jika ada)
        window.location.href = 'login.html';
    }
}

// ==================== INISIALISASI CHART ====================
function initializeCharts() {
    // Revenue Chart (halaman index & analytics)
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        charts.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#6c5ce7',
                        borderWidth: 2
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { callback: value => '$' + value }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Category Chart (index)
    const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');
    if (categoryCtx) {
        charts.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Living', 'Books'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#00b894'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
                            font: { size: 12 },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.label}: ${ctx.raw}%`
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Traffic Chart (analytics)
    const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
    if (trafficCtx) {
        charts.trafficChart = new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social Media', 'Search Engines', 'Email', 'Referrals'],
                datasets: [{
                    data: [40, 25, 20, 10, 5],
                    backgroundColor: ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#00b894']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Demographics Chart (analytics)
    const demographicsCtx = document.getElementById('demographicsChart')?.getContext('2d');
    if (demographicsCtx) {
        charts.demographicsChart = new Chart(demographicsCtx, {
            type: 'bar',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    label: 'Users',
                    data: [20, 45, 25, 15, 10],
                    backgroundColor: '#6c5ce7'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Sales Chart (sales)
    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        charts.salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 25000],
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Customer Growth Chart (customers)
    const growthCtx = document.getElementById('customerGrowthChart')?.getContext('2d');
    if (growthCtx) {
        charts.growthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Customers',
                    data: [65, 75, 85, 95, 110, 130],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    // Customer Segments Chart (customers)
    const segmentsCtx = document.getElementById('customerSegmentsChart')?.getContext('2d');
    if (segmentsCtx) {
        charts.segmentsChart = new Chart(segmentsCtx, {
            type: 'pie',
            data: {
                labels: ['VIP', 'Regular', 'New', 'Inactive'],
                datasets: [{
                    data: [15, 45, 30, 10],
                    backgroundColor: ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055']
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}

// ==================== UPDATE CHART ====================
function updateChart(period) {
    if (!charts.revenueChart) return;
    
    let newData, newLabels;
    switch(period) {
        case 'week':
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [12000, 19000, 15000, 25000, 22000, 30000, 28000];
            break;
        case 'month':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [45000, 52000, 48000, 60000];
            break;
        case 'year':
            newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            newData = [35000, 42000, 38000, 45000, 50000, 55000, 60000, 58000, 62000, 68000, 72000, 80000];
            break;
    }
    
    charts.revenueChart.data.labels = newLabels;
    charts.revenueChart.data.datasets[0].data = newData;
    charts.revenueChart.update();
}

function updateSalesChart() {
    const period = document.getElementById('salesPeriod')?.value;
    if (!charts.salesChart || !period) return;
    
    let newData;
    switch(period) {
        case 'daily':
            charts.salesChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [1200, 1900, 1500, 2500, 2200, 3000, 2800];
            break;
        case 'weekly':
            charts.salesChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [12000, 19000, 15000, 25000];
            break;
        case 'monthly':
            charts.salesChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            newData = [45000, 52000, 48000, 60000, 55000, 70000];
            break;
    }
    charts.salesChart.data.datasets[0].data = newData;
    charts.salesChart.update();
}

// ==================== LOAD DATA TABEL ====================
function loadData() {
    loadRecentOrders();
    loadTopProducts();
    loadTopPages();
    loadAllOrders();
    loadCustomers();
    loadScheduledReports();
    loadRecentReports();
}

function loadRecentOrders() {
    const tbody = document.getElementById('recentOrders');
    if (!tbody) return;
    
    const orders = [
        { id: '#ORD-001', customer: 'John Doe', product: 'iPhone 13 Pro', amount: '$1,299', status: 'completed' },
        { id: '#ORD-002', customer: 'Jane Smith', product: 'MacBook Air', amount: '$1,899', status: 'pending' },
        { id: '#ORD-003', customer: 'Mike Johnson', product: 'AirPods Pro', amount: '$249', status: 'processing' },
        { id: '#ORD-004', customer: 'Sarah Wilson', product: 'iPad Pro', amount: '$999', status: 'completed' },
        { id: '#ORD-005', customer: 'Tom Brown', product: 'Apple Watch', amount: '$399', status: 'processing' }
    ];
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.amount}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        </tr>
    `).join('');
}

function loadTopProducts() {
    const container = document.getElementById('topProducts');
    if (!container) return;
    
    const products = [
        { name: 'iPhone 13 Pro', category: 'Electronics', sales: 1234, revenue: '$1.2M', icon: 'fa-mobile-alt' },
        { name: 'MacBook Pro', category: 'Computers', sales: 892, revenue: '$1.8M', icon: 'fa-laptop' },
        { name: 'AirPods Max', category: 'Audio', sales: 756, revenue: '$0.9M', icon: 'fa-headphones' },
        { name: 'iPad Air', category: 'Tablets', sales: 645, revenue: '$0.7M', icon: 'fa-tablet-alt' },
        { name: 'Apple Watch', category: 'Wearables', sales: 523, revenue: '$0.4M', icon: 'fa-clock' }
    ];
    
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-info">
                <i class="fas ${product.icon}"></i>
                <div class="product-details">
                    <h4>${product.name}</h4>
                    <p>${product.category}</p>
                </div>
            </div>
            <div class="product-stats">
                <div class="sales">${product.sales} sales</div>
                <div class="revenue">${product.revenue}</div>
            </div>
        </div>
    `).join('');
}

function loadTopPages() {
    const tbody = document.getElementById('topPages');
    if (!tbody) return;
    
    const pages = [
        { page: '/home', views: '45.2K', unique: '32.1K', avgTime: '2m 34s', bounce: '42%' },
        { page: '/products', views: '32.8K', unique: '24.3K', avgTime: '3m 12s', bounce: '38%' },
        { page: '/about', views: '18.5K', unique: '15.2K', avgTime: '1m 45s', bounce: '55%' },
        { page: '/contact', views: '12.3K', unique: '10.1K', avgTime: '1m 20s', bounce: '60%' }
    ];
    
    tbody.innerHTML = pages.map(p => `
        <tr>
            <td>${p.page}</td>
            <td>${p.views}</td>
            <td>${p.unique}</td>
            <td>${p.avgTime}</td>
            <td>${p.bounce}</td>
        </tr>
    `).join('');
}

function loadAllOrders() {
    const tbody = document.getElementById('allOrders');
    if (!tbody) return;
    
    const orders = [
        { id: '#ORD-001', customer: 'John Doe', date: '2025-03-15', products: 'iPhone 13 Pro', total: '$1,299', payment: 'Credit Card', status: 'completed' },
        { id: '#ORD-002', customer: 'Jane Smith', date: '2025-03-14', products: 'MacBook Air', total: '$1,899', payment: 'Bank Transfer', status: 'pending' },
        { id: '#ORD-003', customer: 'Mike Johnson', date: '2025-03-14', products: 'AirPods Pro', total: '$249', payment: 'Credit Card', status: 'processing' },
        { id: '#ORD-004', customer: 'Sarah Wilson', date: '2025-03-13', products: 'iPad Pro', total: '$999', payment: 'PayPal', status: 'completed' }
    ];
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.products}</td>
            <td>${order.total}</td>
            <td>${order.payment}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewOrder('${order.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editOrder('${order.id}')"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadCustomers() {
    const tbody = document.getElementById('customersList');
    if (!tbody) return;
    
    const customers = [
        { name: 'John Doe', email: 'john@example.com', phone: '+62 812-3456-7890', orders: 12, spent: '$2,345', segment: 'VIP', status: 'active' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '+62 813-4567-8901', orders: 8, spent: '$1,234', segment: 'Regular', status: 'active' },
        { name: 'Mike Johnson', email: 'mike@example.com', phone: '+62 814-5678-9012', orders: 3, spent: '$567', segment: 'New', status: 'inactive' }
    ];
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.orders}</td>
            <td>${c.spent}</td>
            <td><span class="role-badge ${c.segment.toLowerCase()}">${c.segment}</span></td>
            <td><span class="status-badge status-${c.status}">${c.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewCustomer('${c.email}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editCustomer('${c.email}')"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadScheduledReports() {
    const container = document.getElementById('scheduledReports');
    if (!container) return;
    
    const reports = [
        { name: 'Weekly Sales Report', frequency: 'Every Monday', format: 'PDF', nextRun: '2025-03-17' },
        { name: 'Customer Summary', frequency: '1st of month', format: 'Excel', nextRun: '2025-04-01' }
    ];
    
    container.innerHTML = reports.map(r => `
        <div class="report-item">
            <div class="report-info">
                <h4>${r.name}</h4>
                <p>${r.frequency} • ${r.format} • Next: ${r.nextRun}</p>
            </div>
            <div class="report-actions">
                <button class="btn-icon" onclick="editReport('${r.name}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteReport('${r.name}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function loadRecentReports() {
    const container = document.getElementById('recentReports');
    if (!container) return;
    
    const reports = [
        { name: 'Sales Report - March 2025', date: '2025-03-15', size: '2.3 MB' },
        { name: 'Customer Analysis - Q1 2025', date: '2025-03-10', size: '1.8 MB' }
    ];
    
    container.innerHTML = reports.map(r => `
        <div class="report-item">
            <div class="report-info">
                <h4>${r.name}</h4>
                <p>${r.date} • ${r.size}</p>
            </div>
            <button class="btn-icon" onclick="downloadReport('${r.name}')"><i class="fas fa-download"></i></button>
        </div>
    `).join('');
}

// ==================== MODAL ====================
function initializeModals() {
    // Tutup modal jika klik di luar
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId + 'Modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Order functions
function createOrder(e) {
    e.preventDefault();
    alert('Order created successfully!');
    closeModal();
}

function viewOrder(orderId) {
    alert(`Viewing order ${orderId}`);
}

function editOrder(orderId) {
    alert(`Editing order ${orderId}`);
}

// Customer functions
function addCustomer(e) {
    e.preventDefault();
    alert('Customer added successfully!');
    closeModal();
}

function viewCustomer(email) {
    alert(`Viewing customer ${email}`);
}

function editCustomer(email) {
    alert(`Editing customer ${email}`);
}

// Report functions
function generateReport() {
    alert('Generate report functionality');
}

function applyReportFilters() {
    alert('Applying filters...');
}

function viewReport(type) {
    alert(`Viewing ${type} report`);
}

function scheduleReport() {
    alert('Schedule report functionality');
}

function clearHistory() {
    if (confirm('Clear all report history?')) {
        alert('History cleared');
    }
}

function downloadReport(name) {
    alert(`Downloading ${name}`);
}

function editReport(name) {
    alert(`Editing report ${name}`);
}

function deleteReport(name) {
    if (confirm(`Delete report ${name}?`)) {
        alert(`Report ${name} deleted`);
    }
}

function exportData(type) {
    alert(`Exporting ${type} data...`);
}

// ==================== FILTER & SEARCH ====================
function filterOrders() {
    alert('Filter orders functionality');
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    document.querySelector('.page-info').textContent = `Page ${currentPage} of 10`;
    loadAllOrders(); // Reload data with new page
}

// ==================== SETTINGS FUNCTIONS ====================
function initializeTabs() {
    // Jika ada tab settings, set active berdasarkan hash atau default
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    }
}

function switchTab(tabName) {
    // Update active button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName) || btn.getAttribute('onclick')?.includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Show selected section
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(tabName);
    if (activeSection) {
        activeSection.classList.add('active');
        // Update URL hash
        window.location.hash = tabName;
    }
}

// Profile
function uploadPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.profile-preview').src = e.target.result;
                alert('Photo uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function removePhoto() {
    if (confirm('Remove profile photo?')) {
        document.querySelector('.profile-preview').src = 'https://ui-avatars.com/api/?name=Ivo+Mahendra&background=6c5ce7&color=fff&size=128';
        alert('Photo removed');
    }
}

// Security
function changePassword() {
    alert('Password change functionality (would connect to backend)');
}

function revokeSession() {
    if (confirm('Revoke this session?')) {
        alert('Session revoked');
    }
}

function revokeAllSessions() {
    if (confirm('Sign out all other devices?')) {
        alert('All other sessions signed out');
    }
}

// Team
function inviteMember() {
    const email = prompt('Enter email address to invite:');
    if (email) {
        alert(`Invitation sent to ${email}`);
    }
}

function editMember(memberId) {
    alert(`Edit member ${memberId}`);
}

function removeMember(memberId) {
    if (confirm(`Remove member ${memberId}?`)) {
        alert(`Member ${memberId} removed`);
    }
}

// Billing
function upgradePlan() {
    alert('Upgrade plan functionality');
}

function addPaymentMethod() {
    alert('Add payment method');
}

function editPayment() {
    alert('Edit payment method');
}

function downloadInvoice() {
    alert('Download invoice');
}

function viewAllInvoices() {
    alert('View all invoices');
}

// Save settings
function saveSettings() {
    alert('Settings saved successfully!');
}

// ==================== NOTIFICATIONS ====================
document.querySelector('.notification-btn')?.addEventListener('click', () => {
    alert('You have 3 new notifications:\n- New order #ORD-006\n- New customer registered\n- Weekly report ready');
});

// ==================== SEARCH ====================
document.querySelector('.search-bar input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        alert(`Searching for: ${query}`);
    }
});

// ==================== REAL-TIME UPDATE (DEMO) ====================
// Uncomment untuk simulasi update real-time setiap 30 detik
// setInterval(() => {
//     // Update stats dengan angka random
//     document.querySelectorAll('.stat-value').forEach(el => {
//         if (el.id === 'totalRevenue') {
//             el.textContent = '$' + (Math.floor(Math.random() * 50000) + 30000).toLocaleString();
//         } else if (el.id === 'totalOrders') {
//             el.textContent = Math.floor(Math.random() * 1000) + 500;
//         }
//     });
//     
//     // Update chart dengan data random
//     if (charts.revenueChart) {
//         const newData = charts.revenueChart.data.datasets[0].data.map(() => Math.floor(Math.random() * 5000) + 1000);
//         charts.revenueChart.data.datasets[0].data = newData;
//         charts.revenueChart.update();
//     }
// }, 30000);

// ==================== RESPONSIVE ====================
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        document.querySelector('.sidebar')?.classList.remove('active');
        const icon = document.querySelector('.menu-toggle i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});