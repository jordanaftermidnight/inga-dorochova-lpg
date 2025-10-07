// Terra Salon and Wellness Spa - Booking System
class BookingSystem {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.selectedTreatment = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.treatments = [];
        this.availableSlots = [];
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadTreatments();
            this.setupEventListeners();
            this.generateCalendar();
            this.updateStepDisplay();
        } catch (error) {
            console.error('Booking system initialization failed:', error);
            this.showError('Failed to load booking system. Please refresh the page.');
        }
    }
    
    async loadTreatments() {
        try {
            // For now, using static data. In production, this would fetch from API
            this.treatments = [
                {
                    id: 'lpg-face',
                    name: 'LPG Endermologie Face Treatment',
                    description: 'Anti-aging facial treatment using latest LPG technology',
                    duration: 45,
                    price: 160,
                    features: ['Collagen stimulation', 'Skin tightening', 'Wrinkle reduction', 'Improved circulation']
                },
                {
                    id: 'lpg-body',
                    name: 'LPG Endermologie Body Treatment',
                    description: 'Cellulite reduction and body contouring treatment',
                    duration: 60,
                    price: 190,
                    features: ['Cellulite reduction', 'Body contouring', 'Improved circulation', 'Skin firming']
                },
                {
                    id: 'lpg-alliance-full',
                    name: 'LPG Alliance Full Treatment',
                    description: 'Complete LPG Alliance treatment for face and body',
                    duration: 90,
                    price: 280,
                    features: ['Full body treatment', 'Face and body', 'Complete LPG experience', 'Maximum results']
                },
                {
                    id: 'discovery-session',
                    name: 'Discovery Session',
                    description: 'First-time consultation and mini treatment',
                    duration: 30,
                    price: 80,
                    features: ['Consultation', 'Skin analysis', 'Mini treatment', 'Treatment plan']
                },
                {
                    id: 'face-package-5',
                    name: '5-Session Face Package',
                    description: 'Package of 5 LPG face treatments with savings',
                    duration: 225,
                    price: 720,
                    originalPrice: 800,
                    features: ['5 face sessions', '15% savings', '6 month validity', 'Progress tracking']
                },
                {
                    id: 'body-package-10',
                    name: '10-Session Body Package',
                    description: 'Package of 10 LPG body treatments with savings',
                    duration: 600,
                    price: 1710,
                    originalPrice: 1900,
                    features: ['10 body sessions', '20% savings', '6 month validity', 'Progress tracking']
                }
            ];
            
            this.renderTreatments();
        } catch (error) {
            throw new Error('Failed to load treatments: ' + error.message);
        }
    }
    
    renderTreatments() {
        const grid = document.getElementById('treatment-grid');
        grid.innerHTML = '';
        
        this.treatments.forEach(treatment => {
            const card = document.createElement('div');
            card.className = 'treatment-card';
            card.dataset.treatmentId = treatment.id;
            
            const savingsInfo = treatment.originalPrice ? 
                `<div class="savings-badge">Save $${treatment.originalPrice - treatment.price}</div>` : '';
            
            const originalPriceDisplay = treatment.originalPrice ? 
                `<span class="original-price">$${treatment.originalPrice}</span>` : '';
            
            card.innerHTML = `
                ${savingsInfo}
                <h3>${treatment.name}</h3>
                <p class="treatment-description">${treatment.description}</p>
                <div class="treatment-details">
                    <div class="duration">
                        <i class="fas fa-clock"></i>
                        ${treatment.duration} minutes
                    </div>
                    <div class="price">
                        ${originalPriceDisplay}
                        <span class="current-price">$${treatment.price}</span>
                    </div>
                </div>
                <ul class="treatment-features">
                    ${treatment.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            `;
            
            card.addEventListener('click', () => this.selectTreatment(treatment));
            grid.appendChild(card);
        });
    }
    
    selectTreatment(treatment) {
        // Remove previous selection
        document.querySelectorAll('.treatment-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-treatment-id="${treatment.id}"]`);
        selectedCard.classList.add('selected');
        
        this.selectedTreatment = treatment;
        
        // Show next button
        document.getElementById('next-btn').classList.remove('hidden');
    }
    
    generateCalendar() {
        const grid = document.getElementById('calendar-grid');
        const monthYearDisplay = document.getElementById('calendar-month-year');
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        monthYearDisplay.textContent = `${months[this.currentMonth]} ${this.currentYear}`;
        
        // Clear grid
        grid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.textContent = day;
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            header.style.padding = '0.5rem';
            header.style.color = '#6c757d';
            grid.appendChild(header);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            grid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const currentDate = new Date(this.currentYear, this.currentMonth, day);
            
            // Disable past dates and Sundays
            if (currentDate < today || currentDate.getDay() === 0) {
                dayElement.classList.add('unavailable');
            } else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(currentDate));
            }
            
            grid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        // Remove previous date selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked date
        event.target.classList.add('selected');
        
        this.selectedDate = date;
        this.loadTimeSlots(date);
    }
    
    async loadTimeSlots(date) {
        const container = document.getElementById('time-slots-container');
        container.innerHTML = '<p>Loading available times...</p>';
        
        try {
            // Fetch actual available slots from API
            const dateString = date.toISOString().split('T')[0];
            const response = await fetch(`/api/appointments/available-slots/${dateString}`);
            const data = await response.json();
            
            container.innerHTML = '';
            
            if (!data.available || data.slots.length === 0) {
                container.innerHTML = '<p>No available times for this date</p>';
                return;
            }
            
            data.slots.forEach(time => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = time;
                slot.addEventListener('click', () => this.selectTime(time));
                container.appendChild(slot);
            });
            
        } catch (error) {
            container.innerHTML = '<p>Error loading time slots</p>';
            console.error('Error loading time slots:', error);
        }
    }
    
    generateTimeSlots(date) {
        const slots = [];
        const dayOfWeek = date.getDay();
        
        // Business hours (Monday-Saturday)
        let startHour = 9;
        let endHour = 18;
        
        if (dayOfWeek === 6) { // Saturday
            endHour = 16;
        } else if (dayOfWeek === 4) { // Thursday
            endHour = 19;
        }
        
        // Generate 30-minute slots
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        
        return slots;
    }
    
    selectTime(time) {
        // Remove previous time selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked time
        event.target.classList.add('selected');
        
        this.selectedTime = time;
        
        // Show next button
        document.getElementById('next-btn').classList.remove('hidden');
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('back-btn').addEventListener('click', () => this.prevStep());
        
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.generateCalendar();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.generateCalendar();
        });
        
        // Form submission
        document.getElementById('confirm-booking').addEventListener('click', () => this.processBooking());
        document.getElementById('back-to-info').addEventListener('click', () => this.prevStep());
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            
            if (this.currentStep === 4) {
                this.generateBookingSummary();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedTreatment) {
                    this.showError('Please select a treatment');
                    return false;
                }
                break;
            case 2:
                if (!this.selectedDate || !this.selectedTime) {
                    this.showError('Please select both date and time');
                    return false;
                }
                break;
            case 3:
                return this.validateClientForm();
        }
        return true;
    }
    
    validateClientForm() {
        const form = document.getElementById('client-form');
        const formData = new FormData(form);
        const required = ['firstName', 'lastName', 'email', 'phone'];
        
        for (let field of required) {
            if (!formData.get(field)) {
                this.showError(`${field} is required`);
                return false;
            }
        }
        
        // Validate email format
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    updateStepDisplay() {
        // Hide all sections
        document.querySelectorAll('.booking-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show current section
        const sections = ['treatment-selection', 'datetime-selection', 'client-information', 'booking-confirmation'];
        document.getElementById(sections[this.currentStep - 1]).classList.remove('hidden');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update navigation buttons
        const backBtn = document.getElementById('back-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (this.currentStep === 1) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }
        
        if (this.currentStep === this.maxSteps) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
        
        // Initially hide next button until selection is made
        if ((this.currentStep === 1 && !this.selectedTreatment) || 
            (this.currentStep === 2 && (!this.selectedDate || !this.selectedTime))) {
            nextBtn.classList.add('hidden');
        }
    }
    
    generateBookingSummary() {
        const summary = document.getElementById('booking-summary');
        const form = document.getElementById('client-form');
        const formData = new FormData(form);
        
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        
        const calculateTax = (amount) => {
            const taxRate = 0.1025; // Cook County 10.25%
            return amount * taxRate;
        };
        
        const serviceAmount = this.selectedTreatment.price;
        const taxAmount = calculateTax(serviceAmount);
        const totalAmount = serviceAmount + taxAmount;
        
        summary.innerHTML = `
            <h3><i class="fas fa-calendar-check"></i> Appointment Summary</h3>
            <div style="margin: 1.5rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <strong>Treatment:</strong><br>
                        ${this.selectedTreatment.name}
                    </div>
                    <div>
                        <strong>Duration:</strong><br>
                        ${this.selectedTreatment.duration} minutes
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <strong>Date:</strong><br>
                        ${formatDate(this.selectedDate)}
                    </div>
                    <div>
                        <strong>Time:</strong><br>
                        ${this.selectedTime}
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong>Client:</strong><br>
                    ${formData.get('firstName')} ${formData.get('lastName')}<br>
                    ${formData.get('email')}<br>
                    ${formData.get('phone')}
                </div>
                
                <hr style="border-color: rgba(255,255,255,0.3); margin: 1.5rem 0;">
                
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
                    <span>Service Amount:</span>
                    <span>$${serviceAmount.toFixed(2)}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 0.5rem;">
                    <span>Tax (Cook County 10.25%):</span>
                    <span>$${taxAmount.toFixed(2)}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; font-weight: bold; font-size: 1.2rem; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 0.5rem;">
                    <span>Total Amount:</span>
                    <span>$${totalAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
                <small>
                    <i class="fas fa-info-circle"></i>
                    <strong>Payment at Salon:</strong> Your appointment will be confirmed and payment will be collected at Terra Salon and Wellness Spa during your visit.
                </small>
            </div>
        `;
    }
    
    async processBooking() {
        const confirmBtn = document.getElementById('confirm-booking');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            const form = document.getElementById('client-form');
            const formData = new FormData(form);
            
            const bookingData = {
                treatment: this.selectedTreatment,
                date: this.selectedDate.toISOString().split('T')[0],
                time: this.selectedTime,
                client: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    notes: formData.get('notes'),
                    newClient: formData.get('newClient') === 'on'
                }
            };
            
            // Call real API to save booking
            const response = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Booking failed');
            }
            
            const result = await response.json();
            
            this.showSuccess('Appointment confirmed! You will pay at the salon.');
            
            // Store booking ID for confirmation page
            localStorage.setItem('lastBookingId', result.appointment.id);
            
            // Redirect to success page
            setTimeout(() => {
                window.location.href = 'booking-success.html';
            }, 2000);
            
        } catch (error) {
            console.error('Booking error:', error);
            this.showError(error.message || 'Booking failed. Please try again.');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Appointment';
        }
    }
    
    async simulateBookingAPI(bookingData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true, bookingId: 'BOOKING_' + Date.now() });
                } else {
                    reject(new Error('Booking service temporarily unavailable'));
                }
            }, 2000);
        });
    }
    
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize booking system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});