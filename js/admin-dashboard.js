// Terra Salon and Wellness Spa - Admin Dashboard
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.appointments = [];
        this.clients = [];
        this.treatments = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.checkAuthentication();
            this.setupEventListeners();
            await this.loadDashboardData();
            this.setupRealTimeUpdates();
        } catch (error) {
            console.error('Admin dashboard initialization failed:', error);
            this.redirectToLogin();
        }
    }
    
    async checkAuthentication() {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        
        if (!token || !user) {
            throw new Error('No admin session found');
        }
        
        try {
            this.currentUser = JSON.parse(user);
            this.updateUserDisplay();
            
        } catch (error) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            throw error;
        }
    }
    
    updateUserDisplay() {
        if (this.currentUser) {
            document.getElementById('admin-name').textContent = 
                `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            document.getElementById('admin-avatar').textContent = 
                this.currentUser.firstName.charAt(0).toUpperCase();
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Global search
        document.getElementById('global-search').addEventListener('input', 
            this.debounce((e) => this.globalSearch(e.target.value), 300)
        );
        
        // Appointment filters
        document.getElementById('appointment-filter')?.addEventListener('change', (e) => {
            this.filterAppointments(e.target.value);
        });
        
        // Add buttons
        document.getElementById('add-appointment-btn')?.addEventListener('click', () => {
            this.showAddAppointmentModal();
        });
        
        document.getElementById('add-client-btn')?.addEventListener('click', () => {
            this.showAddClientModal();
        });
    }
    
    async loadDashboardData() {
        try {
            // Load all dashboard data in parallel
            await Promise.all([
                this.loadStats(),
                this.loadTodaySchedule(),
                this.loadAllAppointments(),
                this.loadAllClients(),
                this.loadTreatments()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }
    
    async loadStats() {
        try {
            // In production, these would be API calls
            const stats = await this.simulateStatsAPI();
            
            document.getElementById('today-appointments').textContent = stats.todayAppointments;
            document.getElementById('weekly-revenue').textContent = `$${stats.weeklyRevenue.toLocaleString()}`;
            document.getElementById('total-clients').textContent = stats.totalClients;
            document.getElementById('pending-bookings').textContent = stats.pendingBookings;
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    async loadTodaySchedule() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/appointments/date/${today}`);
            const appointments = await response.json();
            
            const tbody = document.getElementById('today-schedule');
            tbody.innerHTML = '';
            
            if (appointments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #6c757d;">No appointments scheduled for today</td></tr>';
                return;
            }
            
            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.time}</td>
                    <td>
                        <div>
                            <strong>${appointment.client.firstName} ${appointment.client.lastName}</strong>
                            <br>
                            <small class="text-muted">${appointment.client.phone}</small>
                        </div>
                    </td>
                    <td>${appointment.treatment.name}</td>
                    <td>
                        <span class="status-badge status-${appointment.status}">
                            ${appointment.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="adminDashboard.viewAppointment('${appointment.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="adminDashboard.completeAppointment('${appointment.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
        } catch (error) {
            console.error('Error loading today\'s schedule:', error);
            const tbody = document.getElementById('today-schedule');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #dc3545;">Error loading schedule</td></tr>';
        }
    }
    
    async loadAllAppointments() {
        try {
            this.appointments = await this.simulateAppointmentsAPI();
            this.renderAppointmentsTable();
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    }
    
    renderAppointmentsTable(appointments = this.appointments) {
        const tbody = document.getElementById('appointments-table');
        tbody.innerHTML = '';
        
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #6c757d;">No appointments found</td></tr>';
            return;
        }
        
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div>
                        <strong>${appointment.date}</strong>
                        <br>
                        <small>${appointment.time}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${appointment.client.firstName} ${appointment.client.lastName}</strong>
                        <br>
                        <small class="text-muted">${appointment.client.email}</small>
                    </div>
                </td>
                <td>${appointment.treatment.name}</td>
                <td>${appointment.treatment.duration} min</td>
                <td>
                    <span class="status-badge status-${appointment.status}">
                        ${appointment.status}
                    </span>
                </td>
                <td>$${appointment.amount.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.editAppointment('${appointment.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.cancelAppointment('${appointment.id}')" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    async loadAllClients() {
        try {
            this.clients = await this.simulateClientsAPI();
            this.renderClientsTable();
        } catch (error) {
            console.error('Error loading clients:', error);
        }
    }
    
    renderClientsTable(clients = this.clients) {
        const tbody = document.getElementById('clients-table');
        tbody.innerHTML = '';
        
        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6c757d;">No clients found</td></tr>';
            return;
        }
        
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div>
                        <strong>${client.firstName} ${client.lastName}</strong>
                        <br>
                        <small class="text-muted">ID: ${client.id.substring(0, 8)}</small>
                    </div>
                </td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.lastVisit || 'Never'}</td>
                <td>$${client.totalSpent.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminDashboard.viewClient('${client.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editClient('${client.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    filterAppointments(status) {
        let filtered = this.appointments;
        
        if (status !== 'all') {
            filtered = this.appointments.filter(apt => apt.status === status);
        }
        
        this.renderAppointmentsTable(filtered);
    }
    
    globalSearch(query) {
        if (!query || query.length < 2) {
            return;
        }
        
        // Search across appointments and clients
        console.log('Searching for:', query);
        // Implementation would search through data and highlight results
    }
    
    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(section).classList.add('active');
        
        // Add active class to nav link
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        this.currentSection = section;
    }
    
    // Appointment Actions
    async viewAppointment(appointmentId) {
        console.log('Viewing appointment:', appointmentId);
        // Implementation would show appointment details modal
    }
    
    async editAppointment(appointmentId) {
        console.log('Editing appointment:', appointmentId);
        // Implementation would show edit appointment modal
    }
    
    async cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                // API call to cancel appointment
                console.log('Cancelling appointment:', appointmentId);
                await this.loadAllAppointments(); // Refresh data
                this.showSuccess('Appointment cancelled successfully');
            } catch (error) {
                this.showError('Failed to cancel appointment');
            }
        }
    }
    
    async completeAppointment(appointmentId) {
        try {
            // API call to mark appointment as completed
            console.log('Completing appointment:', appointmentId);
            await this.loadTodaySchedule(); // Refresh today's schedule
            this.showSuccess('Appointment marked as completed');
        } catch (error) {
            this.showError('Failed to complete appointment');
        }
    }
    
    // Client Actions
    async viewClient(clientId) {
        console.log('Viewing client:', clientId);
        // Implementation would show client details modal
    }
    
    async editClient(clientId) {
        console.log('Editing client:', clientId);
        // Implementation would show edit client modal
    }
    
    // Modal Functions
    showAddAppointmentModal() {
        console.log('Show add appointment modal');
        // Implementation would show modal for adding new appointment
    }
    
    showAddClientModal() {
        console.log('Show add client modal');
        // Implementation would show modal for adding new client
    }
    
    // Utility Functions
    async apiCall(url, options = {}) {
        const token = localStorage.getItem('adminToken');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        
        return response.json();
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    showError(message) {
        // Implementation would show error notification
        console.error(message);
    }
    
    showSuccess(message) {
        // Implementation would show success notification
        console.log(message);
    }
    
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'admin-login.html';
    }
    
    redirectToLogin() {
        window.location.href = 'admin-login.html';
    }
    
    setupRealTimeUpdates() {
        // In production, this would set up WebSocket connection for real-time updates
        setInterval(async () => {
            if (this.currentSection === 'dashboard') {
                await this.loadStats();
                await this.loadTodaySchedule();
            }
        }, 60000); // Update every minute
    }
    
    // Simulation Functions (for development)
    async simulateStatsAPI() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    todayAppointments: 8,
                    weeklyRevenue: 3420,
                    totalClients: 156,
                    pendingBookings: 3
                });
            }, 500);
        });
    }
    
    async simulateAppointmentsAPI(filters = {}) {
        return new Promise(resolve => {
            setTimeout(() => {
                const appointments = [
                    {
                        id: 'apt_1',
                        date: '2025-01-15',
                        time: '09:00',
                        client: {
                            firstName: 'Sarah',
                            lastName: 'Johnson',
                            email: 'sarah.j@email.com',
                            phone: '(847) 555-0123'
                        },
                        treatment: {
                            name: 'LPG Face Treatment',
                            duration: 45
                        },
                        status: 'confirmed',
                        amount: 160.00
                    },
                    {
                        id: 'apt_2',
                        date: '2025-01-15',
                        time: '10:30',
                        client: {
                            firstName: 'Michael',
                            lastName: 'Chen',
                            email: 'mchen@email.com',
                            phone: '(847) 555-0456'
                        },
                        treatment: {
                            name: 'LPG Body Treatment',
                            duration: 60
                        },
                        status: 'scheduled',
                        amount: 190.00
                    },
                    {
                        id: 'apt_3',
                        date: '2025-01-15',
                        time: '14:00',
                        client: {
                            firstName: 'Emily',
                            lastName: 'Rodriguez',
                            email: 'emily.r@email.com',
                            phone: '(847) 555-0789'
                        },
                        treatment: {
                            name: 'Discovery Session',
                            duration: 30
                        },
                        status: 'confirmed',
                        amount: 80.00
                    }
                ];
                
                let filtered = appointments;
                
                if (filters.date) {
                    filtered = appointments.filter(apt => apt.date === filters.date);
                }
                
                resolve(filtered);
            }, 300);
        });
    }
    
    async simulateClientsAPI() {
        return new Promise(resolve => {
            setTimeout(() => {
                const clients = [
                    {
                        id: 'client_1',
                        firstName: 'Sarah',
                        lastName: 'Johnson',
                        email: 'sarah.j@email.com',
                        phone: '(847) 555-0123',
                        lastVisit: '2025-01-10',
                        totalSpent: 480.00
                    },
                    {
                        id: 'client_2',
                        firstName: 'Michael',
                        lastName: 'Chen',
                        email: 'mchen@email.com',
                        phone: '(847) 555-0456',
                        lastVisit: '2025-01-08',
                        totalSpent: 760.00
                    },
                    {
                        id: 'client_3',
                        firstName: 'Emily',
                        lastName: 'Rodriguez',
                        email: 'emily.r@email.com',
                        phone: '(847) 555-0789',
                        lastVisit: null,
                        totalSpent: 0.00
                    }
                ];
                
                resolve(clients);
            }, 400);
        });
    }
}

// Initialize admin dashboard when page loads
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});