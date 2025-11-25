        // ============================================
        // SUPABASE CONFIGURATION
        // ============================================
        // Replace these with your Supabase project credentials
        // Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
        const SUPABASE_URL = 'https://tsrbhgaksrwscrdvwudg.supabase.co'; // e.g., 'https://xxxxx.supabase.co'
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcmJoZ2Frc3J3c2NyZHZ3dWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDU2NDEsImV4cCI6MjA3OTQ4MTY0MX0.Gvy7zwlDZ6vvouErWO9avUDX9Z2DHJA5UvrYfCIFJo0'; // Your anon/public key
        
        // Initialize Supabase client
        let supabase = null;
        if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        
        // Use Supabase if configured, otherwise fall back to localStorage
        const USE_SUPABASE = supabase !== null;

        // ============================================
        // SUPABASE DATABASE FUNCTIONS
        // ============================================
        
        // Get or create user ID (using localStorage as a simple user identifier)
        function getUserId() {
            let userId = localStorage.getItem('betterskin-user-id');
            if (!userId) {
                userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('betterskin-user-id', userId);
            }
            return userId;
        }

        // Save routines to Supabase
        async function saveRoutinesToSupabase(routines) {
            if (!USE_SUPABASE) {
                localStorage.setItem('betterskin-routines', JSON.stringify(routines));
                return;
            }

            try {
                const userId = getUserId();
                const { error } = await supabase
                    .from('routines')
                    .upsert({
                        user_id: userId,
                        routines_data: routines,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id'
                    });

                if (error) throw error;
            } catch (error) {
                // Fallback to localStorage
                localStorage.setItem('betterskin-routines', JSON.stringify(routines));
            }
        }

        // Load routines from Supabase
        async function loadRoutinesFromSupabase() {
            if (!USE_SUPABASE) {
                const saved = localStorage.getItem('betterskin-routines');
                return saved ? JSON.parse(saved) : null;
            }

            try {
                const userId = getUserId();
                const { data, error } = await supabase
                    .from('routines')
                    .select('routines_data')
                    .eq('user_id', userId)
                    .single();

                if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
                
                if (data) {
                    return data.routines_data;
                }
                
                // Fallback to localStorage if no Supabase data
                const saved = localStorage.getItem('betterskin-routines');
                try {
                    return saved ? JSON.parse(saved) : null;
                } catch (parseError) {
                    return null;
                }
            } catch (error) {
                // Fallback to localStorage
                const saved = localStorage.getItem('betterskin-routines');
                return saved ? JSON.parse(saved) : null;
            }
        }

        // Save profile to Supabase
        async function saveProfileToSupabase(profile) {
            if (!USE_SUPABASE) {
                localStorage.setItem('betterskin-profile', JSON.stringify(profile));
                return;
            }

            try {
                const userId = getUserId();
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        user_id: userId,
                        profile_data: profile,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id'
                    });

                if (error) throw error;
            } catch (error) {
                localStorage.setItem('betterskin-profile', JSON.stringify(profile));
            }
        }

        // Load profile from Supabase
        async function loadProfileFromSupabase() {
            if (!USE_SUPABASE) {
                const saved = localStorage.getItem('betterskin-profile');
                return saved ? JSON.parse(saved) : null;
            }

            try {
                const userId = getUserId();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('profile_data')
                    .eq('user_id', userId)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                
                if (data) {
                    return data.profile_data;
                }
                
                const saved = localStorage.getItem('betterskin-profile');
                try {
                    return saved ? JSON.parse(saved) : null;
                } catch (parseError) {
                    return null;
                }
            } catch (error) {
                const saved = localStorage.getItem('betterskin-profile');
                try {
                    return saved ? JSON.parse(saved) : null;
                } catch (parseError) {
                    return null;
                }
            }
        }

        // Save schedule to Supabase
        async function saveScheduleToSupabase(schedule, startDate) {
            if (!USE_SUPABASE) {
                localStorage.setItem('betterskin-schedule', JSON.stringify(schedule));
                localStorage.setItem('betterskin-schedule-start', startDate.toISOString());
                return;
            }

            try {
                const userId = getUserId();
                const { error } = await supabase
                    .from('schedules')
                    .upsert({
                        user_id: userId,
                        schedule_data: schedule,
                        start_date: startDate.toISOString(),
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id'
                    });

                if (error) throw error;
            } catch (error) {
                localStorage.setItem('betterskin-schedule', JSON.stringify(schedule));
                localStorage.setItem('betterskin-schedule-start', startDate.toISOString());
            }
        }

        // Load schedule from Supabase
        async function loadScheduleFromSupabase() {
            if (!USE_SUPABASE) {
                const savedSchedule = localStorage.getItem('betterskin-schedule');
                const savedStartDate = localStorage.getItem('betterskin-schedule-start');
                return savedSchedule && savedStartDate ? {
                    schedule: JSON.parse(savedSchedule),
                    startDate: new Date(savedStartDate)
                } : null;
            }

            try {
                const userId = getUserId();
                const { data, error } = await supabase
                    .from('schedules')
                    .select('schedule_data, start_date')
                    .eq('user_id', userId)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                
                if (data) {
                    return {
                        schedule: data.schedule_data,
                        startDate: new Date(data.start_date)
                    };
                }
                
                const savedSchedule = localStorage.getItem('betterskin-schedule');
                const savedStartDate = localStorage.getItem('betterskin-schedule-start');
                if (savedSchedule && savedStartDate) {
                    try {
                        return {
                            schedule: JSON.parse(savedSchedule),
                            startDate: new Date(savedStartDate)
                        };
                    } catch (parseError) {
                        return null;
                    }
                }
                return null;
            } catch (error) {
                const savedSchedule = localStorage.getItem('betterskin-schedule');
                const savedStartDate = localStorage.getItem('betterskin-schedule-start');
                if (savedSchedule && savedStartDate) {
                    try {
                        return {
                            schedule: JSON.parse(savedSchedule),
                            startDate: new Date(savedStartDate)
                        };
                    } catch (parseError) {
                        return null;
                    }
                }
                return null;
            }
        }

        const weatherInfo = {
            temperature: '72°F',
            condition: 'Hazy sun',
            uvIndex: 7,
            humidity: '58%',
            wind: '6 mph',
            message: 'UV index is elevated. Use a broad-spectrum SPF 50 before heading out.'
        };

        let bloodInsights = {
            highlights: [],
            reminders: []
        };

        function renderSummary() {
            updateWeatherSummary();
            updateRoutineSummary();
            updateReminderSummary();
        }

        function updateWeatherSummary() {
            const highlightEl = document.getElementById('weather-highlight');
            const listEl = document.getElementById('weather-details');
            if (!highlightEl || !listEl) return;

            highlightEl.textContent = `${weatherInfo.temperature} / UV ${weatherInfo.uvIndex}`;

            const details = [
                `Condition: ${weatherInfo.condition}`,
                `Humidity: ${weatherInfo.humidity}`,
                `Wind: ${weatherInfo.wind}`,
                getUvGuidance(weatherInfo.uvIndex)
            ];

            populateList(listEl, details);
        }

        function updateRoutineSummary() {
            const highlightEl = document.getElementById('routine-highlight');
            const listEl = document.getElementById('routine-tips');
            if (!highlightEl || !listEl) return;
            
            if (!routines) return;

            const summary = buildRoutineSummary();
            highlightEl.textContent = summary.highlight;
            populateList(listEl, summary.tips);
        }

        function updateReminderSummary() {
            const highlightEl = document.getElementById('reminder-highlight');
            const listEl = document.getElementById('reminder-list');
            if (!highlightEl || !listEl) return;
            
            if (!routines) return;

            const reminders = generateReminderList();
            highlightEl.textContent = reminders.length ? `${reminders.length} priority` : 'All clear';
            populateList(listEl, reminders.length ? reminders : ['No reminders for today.']);
        }

        function populateList(element, items) {
            element.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                element.appendChild(li);
            });
        }

        function getUvGuidance(uvIndex) {
            if (uvIndex >= 8) {
                return 'UV Index: Extreme - limit direct sun and reapply SPF hourly.';
            }
            if (uvIndex >= 6) {
                return 'UV Index: High - apply SPF 50 and reapply within 2 hours.';
            }
            if (uvIndex >= 3) {
                return 'UV Index: Moderate - SPF 30+ is recommended.';
            }
            return 'UV Index: Low - maintain daily SPF to protect skin barrier.';
        }

        function buildRoutineSummary() {
            const tips = [];
            const schedule = getTodayScheduleDay();

            if (!schedule) {
                tips.push('Generate your 7-day schedule to unlock adaptive tracking.');
                if (!hasRoutineProducts()) {
                    tips.push('Add products to your routines to receive guided tips.');
                } else {
                    tips.push('Tap Generate Schedule to keep routines on track.');
                }
                return {
                    highlight: 'Setup needed',
                    tips
                };
            }

            const pendingMorning = countPendingSteps(schedule, 'morning');
            const pendingEvening = countPendingSteps(schedule, 'evening');
            const totalPending = pendingMorning + pendingEvening;

            if (totalPending === 0) {
                tips.push('All scheduled steps are complete. Log how your skin feels tonight.');
            } else {
                if (pendingMorning > 0) {
                    tips.push(`${pendingMorning} morning steps remain - plan a quick reset before midday.`);
                }
                if (pendingEvening > 0) {
                    tips.push(`${pendingEvening} evening steps are queued - stage your products in advance.`);
                }
            }

            if ((userProfile.goals || []).includes('hydration')) {
                tips.push('Press hydrating serums into damp skin for maximum plumpness.');
            }
            if ((userProfile.goals || []).includes('acne-treatment')) {
                tips.push('Spot-treat after cleansing to keep actives targeted and gentle.');
            }

            return {
                highlight: totalPending === 0 ? 'All steps complete' : `${totalPending} steps left`,
                tips
            };
        }

        function hasRoutineProducts() {
            const hasMorning = Object.keys(routines.morning || {}).some(key => (routines.morning[key] || []).length > 0);
            const hasEvening = Object.keys(routines.evening || {}).some(key => (routines.evening[key] || []).length > 0);
            return hasMorning || hasEvening;
        }

        function getTodayScheduleDay() {
            if (!weekSchedule || weekSchedule.length === 0) {
                return null;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return weekSchedule.find(day => {
                const dayDate = new Date(day.date);
                dayDate.setHours(0, 0, 0, 0);
                return dayDate.getTime() === today.getTime();
            }) || null;
        }

        function countPendingSteps(day, routineType) {
            if (!day) return 0;
            const steps = routineType === 'morning' ? day.morning : day.evening;
            const completed = day.completed[routineType];
            return steps.filter(step => !completed.includes(step.id)).length;
        }

        function generateReminderList() {
            const reminders = [...(bloodInsights.reminders || [])];

            // Check for products that need refilling (20% or less)
            const lowProducts = [];
            ['morning', 'evening'].forEach(routineKey => {
                const routine = routines[routineKey] || {};
                Object.keys(routine).forEach(stepKey => {
                    const products = routine[stepKey] || [];
                    products.forEach(product => {
                        const percentage = product.percentageLeft !== undefined ? product.percentageLeft : 100;
                        if (percentage <= 20) {
                            const key = product.name.toLowerCase();
                            if (!lowProducts.find(p => p.name.toLowerCase() === key)) {
                                lowProducts.push({
                                    name: product.name,
                                    percentage: percentage
                                });
                            }
                        }
                    });
                });
            });

            // Add product refill reminders
            lowProducts.forEach(product => {
                if (product.percentage <= 10) {
                    reminders.push(`${product.name} is critically low (${product.percentage}%) - refill urgently!`);
                } else {
                    reminders.push(`${product.name} is running low (${product.percentage}%) - time to refill.`);
                }
            });

            if (weatherInfo.uvIndex >= 5) {
                reminders.push('UV is elevated - reapply sunscreen every two hours outdoors.');
            }
            if ((userProfile.goals || []).includes('anti-aging')) {
                reminders.push('Layer antioxidant serum before SPF to boost protection.');
            }
            if ((userProfile.goals || []).includes('brightening')) {
                reminders.push('Protect from blue light and finish with SPF to preserve brightening gains.');
            }

            const unique = Array.from(new Set(reminders));
            return unique.slice(0, 6); // Increased limit to include product reminders
        }

        // ============================================
        // CENTRALIZED STATE MANAGEMENT
        // ============================================
        // StateManager - Single source of truth for application state
        class StateManager {
            constructor() {
                this.state = {
                    userProfile: {
            age: null,
            gender: null,
            goals: [],
                        problems: [],
                        name: null,
                        skinType: null
                    },
                    routines: {
            morning: {},
            evening: {}
                    },
                    weekSchedule: [],
                    scheduleStartDate: null,
                    currentStep: 0,
                    currentRoutine: 'morning',
                    currentStepType: null,
                    weatherInfo: {
                        temperature: '72°F',
                        condition: 'Hazy sun',
                        uvIndex: 7,
                        humidity: '58%',
                        wind: '6 mph',
                        message: 'UV index is elevated. Use a broad-spectrum SPF 50 before heading out.'
                    },
                    bloodInsights: {
                        highlights: [],
                        reminders: []
                    }
                };
                this.subscribers = new Map();
                this.subscriberIdCounter = 0;
            }

            getState(path = null) {
                if (!path) {
                    return this.deepClone(this.state);
                }
                const keys = path.split('.');
                let value = this.state;
                for (const key of keys) {
                    if (value && typeof value === 'object' && key in value) {
                        value = value[key];
                    } else {
                        return undefined;
                    }
                }
                return this.deepClone(value);
            }

            setState(pathOrUpdates, value = undefined) {
                if (typeof pathOrUpdates === 'string') {
                    this.updateStatePath(pathOrUpdates, value);
                } else if (typeof pathOrUpdates === 'object' && pathOrUpdates !== null) {
                    this.mergeState(pathOrUpdates);
                }
                this.notifySubscribers();
            }

            updateStatePath(path, value) {
                const keys = path.split('.');
                const lastKey = keys.pop();
                let target = this.state;
                for (const key of keys) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    target = target[key];
                }
                target[lastKey] = value;
            }

            mergeState(updates) {
                this.deepMerge(this.state, updates);
            }

            subscribe(callback, path = null) {
                if (typeof callback !== 'function') {
                    throw new Error('Subscriber must be a function');
                }
                const id = this.subscriberIdCounter++;
                this.subscribers.set(id, { callback, path });
                return () => {
                    this.subscribers.delete(id);
                };
            }

            notifySubscribers() {
                const currentState = this.getState();
                this.subscribers.forEach(({ callback, path }) => {
                    try {
                        if (path) {
                            const value = this.getState(path);
                            callback(value, currentState);
                        } else {
                            callback(currentState);
                        }
                    } catch (error) {
                        console.error('Error in state subscriber:', error);
                    }
                });
            }

            deepClone(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                if (obj instanceof Date) {
                    return new Date(obj.getTime());
                }
                if (Array.isArray(obj)) {
                    return obj.map(item => this.deepClone(item));
                }
                const cloned = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        cloned[key] = this.deepClone(obj[key]);
                    }
                }
                return cloned;
            }

            deepMerge(target, source) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        if (
                            source[key] &&
                            typeof source[key] === 'object' &&
                            !Array.isArray(source[key]) &&
                            !(source[key] instanceof Date) &&
                            target[key] &&
                            typeof target[key] === 'object' &&
                            !Array.isArray(target[key]) &&
                            !(target[key] instanceof Date)
                        ) {
                            this.deepMerge(target[key], source[key]);
                        } else {
                            target[key] = this.deepClone(source[key]);
                        }
                    }
                }
            }

            initializeRoutines() {
                if (!this.state.routines.morning) {
                    this.state.routines.morning = {};
                }
                if (!this.state.routines.evening) {
                    this.state.routines.evening = {};
                }
            }
        }

        // Create singleton StateManager instance
        const stateManager = new StateManager();

        // Legacy global variables for backward compatibility (will be removed gradually)
        // These now reference stateManager.state
        let userProfile = new Proxy({}, {
            get: (target, prop) => stateManager.getState('userProfile')[prop],
            set: (target, prop, value) => {
                const profile = stateManager.getState('userProfile');
                profile[prop] = value;
                stateManager.setState({ userProfile: profile });
                return true;
            }
        });

        let routines = new Proxy({}, {
            get: (target, prop) => stateManager.getState('routines')[prop],
            set: (target, prop, value) => {
                const routines = stateManager.getState('routines');
                routines[prop] = value;
                stateManager.setState({ routines });
                return true;
            }
        });

        let weekSchedule = new Proxy([], {
            get: (target, prop) => {
                const schedule = stateManager.getState('weekSchedule');
                if (typeof prop === 'string' && !isNaN(prop)) {
                    return schedule[parseInt(prop)];
                }
                return schedule[prop];
            },
            set: (target, prop, value) => {
                const schedule = stateManager.getState('weekSchedule');
                schedule[prop] = value;
                stateManager.setState({ weekSchedule: schedule });
                return true;
            }
        });

        let scheduleStartDate = new Proxy(null, {
            get: () => stateManager.getState('scheduleStartDate'),
            set: (target, prop, value) => {
                stateManager.setState('scheduleStartDate', value);
                return true;
            }
        });

        let currentRoutine = new Proxy('morning', {
            get: () => stateManager.getState('currentRoutine'),
            set: (target, prop, value) => {
                stateManager.setState('currentRoutine', value);
                return true;
            }
        });

        let currentStep = new Proxy(0, {
            get: () => stateManager.getState('currentStep'),
            set: (target, prop, value) => {
                stateManager.setState('currentStep', value);
                return true;
            }
        });

        // ============================================
        // REACTIVE INITIALIZATION
        // ============================================
        // Initialize from Supabase or localStorage with reactive state management
        async function init() {
            try {
                // Load data from storage
                const savedProfile = await loadProfileFromSupabase();
                const savedRoutines = await loadRoutinesFromSupabase();
                const scheduleData = await loadScheduleFromSupabase();

                // Update state with loaded data (this will trigger UI updates via subscriptions)
                if (savedProfile) {
                    updateUserProfile(savedProfile);
                }

                if (savedRoutines) {
                    updateRoutines(savedRoutines);
                    stateManager.initializeRoutines();
                } else {
                    stateManager.initializeRoutines();
                    syncLegacyVariables();
                }

                // Clean up orphaned products that aren't in the digital shelf
                // Remove specific products that shouldn't be in routines
                if (typeof removeProductsFromRoutines === 'function') {
                    await removeProductsFromRoutines([
                        'CeraVe Foaming Cleanser',
                        'La Roche Posay Moisturizer'
                    ]);
                }

                if (scheduleData) {
                    updateWeekSchedule(scheduleData.schedule);
                    updateScheduleStartDate(scheduleData.startDate);
                }

                // Load biomarkers from localStorage (not migrated to Supabase yet)
                const savedBiomarkers = localStorage.getItem('betterskin-biomarker-data');
            if (savedBiomarkers) {
                try {
                    const parsedBiomarkers = JSON.parse(savedBiomarkers);
                        if (typeof displayAnalysisResults === 'function') {
                    displayAnalysisResults(parsedBiomarkers, { preserveStorage: true });
                        }
                } catch (error) {
                        // Silently fail - biomarker data is optional
                    }
                }

                // Set up reactive subscriptions for automatic UI updates
                setupStateSubscriptions();

                // Initial render
                renderSummary();
            } catch (error) {
                console.error('Failed to initialize application:', error);
                renderSummary();
            }
        }

        // ============================================
        // STATE SUBSCRIPTIONS
        // ============================================
        // Set up subscriptions so UI updates automatically when state changes
        function setupStateSubscriptions() {
            // Subscribe to routines changes - update UI when routines change
            stateManager.subscribe((routines, fullState) => {
                if (typeof loadRoutines === 'function') {
                    loadRoutines();
                }
                if (typeof renderProductShelf === 'function') {
                    renderProductShelf();
                }
                if (typeof generateRoutineTips === 'function') {
                    generateRoutineTips();
                }
            renderSummary();
            }, 'routines');

            // Subscribe to schedule changes - update UI when schedule changes
            stateManager.subscribe((schedule, fullState) => {
                if (typeof loadSchedule === 'function') {
                    loadSchedule();
                }
                renderSummary();
            }, 'weekSchedule');

            // Subscribe to userProfile changes - update UI when profile changes
            stateManager.subscribe((profile, fullState) => {
                if (typeof renderProfileCard === 'function') {
                    renderProfileCard();
                }
                renderSummary();
            }, 'userProfile');

            // Subscribe to all state changes for summary updates
            stateManager.subscribe((fullState) => {
                renderSummary();
            });
        }

        // Navigation
        function showSection(sectionName, element) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(sectionName).classList.add('active');
            if (element) {
                element.classList.add('active');
            }

            if (sectionName === 'routines') {
                loadRoutines();
                loadSchedule();
                generateRoutineTips();
                // Always render shelf when showing routines section
                    renderProductShelf();
            } else if (sectionName === 'today') {
                renderSummary();
            } else if (sectionName === 'onboarding') {
                renderProfileCard();
            }
        }

        function renderProfileCard() {
            const profileCardContainer = document.getElementById('profile-card-container');
            const profileCard = document.getElementById('profile-card');
            const onboardingContainer = document.querySelector('.onboarding-container');
            
            if (!profileCardContainer || !profileCard) return;

            // Check if profile is complete
            if (userProfile.age && userProfile.gender) {
                // Hide onboarding steps, show profile card
                if (onboardingContainer) {
                    onboardingContainer.style.display = 'none';
                }
                profileCardContainer.style.display = 'block';

                // Get profile data
                const name = userProfile.name || 'Not set';
                const age = userProfile.age || 'Not set';
                const gender = userProfile.gender || 'Not set';
                const skinType = userProfile.skinType || 'Not set';
                const goals = userProfile.goals || [];
                const problems = userProfile.problems || [];

                // Format goals and problems
                const goalsTags = goals.length > 0 
                    ? goals.map(goal => `<span class="profile-tag">${escapeHtml(goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</span>`).join('')
                    : '<span style="color: var(--muted); font-style: italic;">No goals set</span>';
                
                const problemsTags = problems.length > 0
                    ? problems.map(problem => `<span class="profile-tag">${escapeHtml(problem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</span>`).join('')
                    : '<span style="color: var(--muted); font-style: italic;">No concerns listed</span>';

                profileCard.innerHTML = `
                    ${name !== 'Not set' ? `
                    <div class="profile-header">
                        <h2 style="margin: 0 0 8px 0; font-size: 1.8rem; color: var(--text);">${escapeHtml(name)}</h2>
                        <p style="margin: 0; color: var(--muted); font-size: 0.95rem;">Your personalized skincare profile</p>
                    </div>
                    ` : ''}
                    <div class="profile-section">
                        <div class="profile-section-header">
                            <div class="profile-section-title">Basic Information</div>
                            <button class="profile-edit-btn" onclick="toggleProfileEdit('basic')">Edit</button>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Name</div>
                            <div class="profile-info-value" id="profile-name-display">${escapeHtml(name === 'Not set' ? 'Not set' : name)}</div>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Age</div>
                            <div class="profile-info-value" id="profile-age-display">${escapeHtml(age)}</div>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Gender</div>
                            <div class="profile-info-value" id="profile-gender-display">${escapeHtml(gender.charAt(0).toUpperCase() + gender.slice(1))}</div>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Skin Type</div>
                            <div class="profile-info-value" id="profile-skin-display">${escapeHtml(skinType === 'Not set' ? 'Not set' : skinType.charAt(0).toUpperCase() + skinType.slice(1))}</div>
                        </div>
                        <div class="profile-edit-mode" id="edit-basic">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" id="edit-name" value="${name === 'Not set' ? '' : escapeHtml(name)}" placeholder="Enter your name" style="margin-bottom: 12px;">
                            </div>
                            <div class="form-group">
                                <label>Age</label>
                                <input type="number" id="edit-age" min="13" max="100" value="${age}" style="margin-bottom: 12px;">
                            </div>
                            <div class="form-group">
                                <label>Gender</label>
                                <div class="radio-group">
                                    <div class="radio-item ${gender === 'male' ? 'selected' : ''}" onclick="selectProfileRadio(this, 'gender', 'male')">
                                        <input type="radio" name="edit-gender" value="male" ${gender === 'male' ? 'checked' : ''}>
                                        <span>Male</span>
                                    </div>
                                    <div class="radio-item ${gender === 'female' ? 'selected' : ''}" onclick="selectProfileRadio(this, 'gender', 'female')">
                                        <input type="radio" name="edit-gender" value="female" ${gender === 'female' ? 'checked' : ''}>
                                        <span>Female</span>
                                    </div>
                                    <div class="radio-item ${gender === 'other' ? 'selected' : ''}" onclick="selectProfileRadio(this, 'gender', 'other')">
                                        <input type="radio" name="edit-gender" value="other" ${gender === 'other' ? 'checked' : ''}>
                                        <span>Other</span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Skin Type</label>
                                <select id="edit-skin-type" style="margin-bottom: 12px;">
                                    <option value="oily" ${skinType === 'oily' ? 'selected' : ''}>Oily</option>
                                    <option value="dry" ${skinType === 'dry' ? 'selected' : ''}>Dry</option>
                                    <option value="combination" ${skinType === 'combination' ? 'selected' : ''}>Combination</option>
                                    <option value="normal" ${(skinType === 'normal' || skinType === 'Not set') ? 'selected' : ''}>Normal</option>
                                    <option value="sensitive" ${skinType === 'sensitive' ? 'selected' : ''}>Sensitive</option>
                                </select>
                            </div>
                            <div class="profile-edit-actions">
                                <button class="btn btn-primary" onclick="saveProfileBasic()">Save</button>
                                <button class="btn btn-secondary" onclick="cancelProfileEdit('basic')">Cancel</button>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <div class="profile-section-header">
                            <div class="profile-section-title">Skincare Goals</div>
                            <button class="profile-edit-btn" onclick="toggleProfileEdit('goals')">Edit</button>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Goals</div>
                            <div class="profile-info-value">
                                <div class="profile-tags" id="profile-goals-display">${goalsTags}</div>
                            </div>
                        </div>
                        <div class="profile-edit-mode" id="edit-goals">
                            <div class="checkbox-group">
                                <div class="checkbox-item ${goals.includes('anti-aging') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'anti-aging')">
                                    <input type="checkbox" value="anti-aging" ${goals.includes('anti-aging') ? 'checked' : ''}>
                                    <span>Anti-aging</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('acne-treatment') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'acne-treatment')">
                                    <input type="checkbox" value="acne-treatment" ${goals.includes('acne-treatment') ? 'checked' : ''}>
                                    <span>Acne Treatment</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('hydration') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'hydration')">
                                    <input type="checkbox" value="hydration" ${goals.includes('hydration') ? 'checked' : ''}>
                                    <span>Hydration</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('brightening') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'brightening')">
                                    <input type="checkbox" value="brightening" ${goals.includes('brightening') ? 'checked' : ''}>
                                    <span>Brightening</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('even-tone') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'even-tone')">
                                    <input type="checkbox" value="even-tone" ${goals.includes('even-tone') ? 'checked' : ''}>
                                    <span>Even Skin Tone</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('reduce-redness') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'reduce-redness')">
                                    <input type="checkbox" value="reduce-redness" ${goals.includes('reduce-redness') ? 'checked' : ''}>
                                    <span>Reduce Redness</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('reduce-pores') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'reduce-pores')">
                                    <input type="checkbox" value="reduce-pores" ${goals.includes('reduce-pores') ? 'checked' : ''}>
                                    <span>Reduce Pores</span>
                                </div>
                                <div class="checkbox-item ${goals.includes('sensitive-skin') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'sensitive-skin')">
                                    <input type="checkbox" value="sensitive-skin" ${goals.includes('sensitive-skin') ? 'checked' : ''}>
                                    <span>Sensitive Skin Care</span>
                                </div>
                            </div>
                            <div class="profile-edit-actions">
                                <button class="btn btn-primary" onclick="saveProfileGoals()">Save</button>
                                <button class="btn btn-secondary" onclick="cancelProfileEdit('goals')">Cancel</button>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <div class="profile-section-header">
                            <div class="profile-section-title">Skin Concerns</div>
                            <button class="profile-edit-btn" onclick="toggleProfileEdit('problems')">Edit</button>
                        </div>
                        <div class="profile-info-item">
                            <div class="profile-info-label">Concerns</div>
                            <div class="profile-info-value">
                                <div class="profile-tags" id="profile-problems-display">${problemsTags}</div>
                            </div>
                        </div>
                        <div class="profile-edit-mode" id="edit-problems">
                            <div class="checkbox-group">
                                <div class="checkbox-item ${problems.includes('acne') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'acne', 'problems')">
                                    <input type="checkbox" value="acne" ${problems.includes('acne') ? 'checked' : ''}>
                                    <span>Acne</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('dryness') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'dryness', 'problems')">
                                    <input type="checkbox" value="dryness" ${problems.includes('dryness') ? 'checked' : ''}>
                                    <span>Dryness</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('oiliness') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'oiliness', 'problems')">
                                    <input type="checkbox" value="oiliness" ${problems.includes('oiliness') ? 'checked' : ''}>
                                    <span>Oiliness</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('dark-spots') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'dark-spots', 'problems')">
                                    <input type="checkbox" value="dark-spots" ${problems.includes('dark-spots') ? 'checked' : ''}>
                                    <span>Dark Spots</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('wrinkles') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'wrinkles', 'problems')">
                                    <input type="checkbox" value="wrinkles" ${problems.includes('wrinkles') ? 'checked' : ''}>
                                    <span>Wrinkles</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('redness') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'redness', 'problems')">
                                    <input type="checkbox" value="redness" ${problems.includes('redness') ? 'checked' : ''}>
                                    <span>Redness</span>
                                </div>
                                <div class="checkbox-item ${problems.includes('sensitivity') ? 'selected' : ''}" onclick="toggleProfileCheckbox(this, 'sensitivity', 'problems')">
                                    <input type="checkbox" value="sensitivity" ${problems.includes('sensitivity') ? 'checked' : ''}>
                                    <span>Sensitivity</span>
                                </div>
                            </div>
                            <div class="profile-edit-actions">
                                <button class="btn btn-primary" onclick="saveProfileProblems()">Save</button>
                                <button class="btn btn-secondary" onclick="cancelProfileEdit('problems')">Cancel</button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Show onboarding steps, hide profile card
                if (onboardingContainer) {
                    onboardingContainer.style.display = 'block';
                }
                profileCardContainer.style.display = 'none';
            }
        }

        function toggleProfileEdit(section) {
            const editMode = document.getElementById(`edit-${section}`);
            if (editMode) {
                editMode.classList.toggle('active');
            }
        }

        function cancelProfileEdit(section) {
            const editMode = document.getElementById(`edit-${section}`);
            if (editMode) {
                editMode.classList.remove('active');
            }
        }

        function selectProfileRadio(element, name, value) {
            document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                radio.closest('.radio-item').classList.remove('selected');
            });
            element.classList.add('selected');
            element.querySelector('input').checked = true;
        }

        function toggleProfileCheckbox(element, value, type = 'goals') {
            element.classList.toggle('selected');
            const checkbox = element.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        }

        async function saveProfileBasic() {
            const name = document.getElementById('edit-name').value.trim();
            const age = document.getElementById('edit-age').value;
            const gender = document.querySelector('input[name="edit-gender"]:checked')?.value;
            const skinType = document.getElementById('edit-skin-type').value;

            if (!age || !gender || !skinType) {
                alert('Please fill in all required fields (Age, Gender, Skin Type)');
                return;
            }

            if (name) {
                userProfile.name = name;
            }
            userProfile.age = age;
            userProfile.gender = gender;
            userProfile.skinType = skinType;

            await saveProfileToSupabase(userProfile);
            cancelProfileEdit('basic');
            renderProfileCard();
            renderSummary(); // Update any summaries that depend on profile
        }

        async function saveProfileGoals() {
            const checkedGoals = Array.from(document.querySelectorAll('#edit-goals input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            
            userProfile.goals = checkedGoals;
            await saveProfileToSupabase(userProfile);
            cancelProfileEdit('goals');
            renderProfileCard();
            renderSummary();
        }

        async function saveProfileProblems() {
            const checkedProblems = Array.from(document.querySelectorAll('#edit-problems input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            
            userProfile.problems = checkedProblems;
            await saveProfileToSupabase(userProfile);
            cancelProfileEdit('problems');
            renderProfileCard();
            renderSummary();
        }

        function showRoutinePanel(panelType, element) {
            document.querySelectorAll('.routine-subtab').forEach(btn => btn.classList.remove('active'));
            if (element) {
                element.classList.add('active');
            }

            const builderPanel = document.getElementById('builder-panel');
            const guidancePanel = document.getElementById('guidance-panel');
            if (!builderPanel || !guidancePanel) {
                return;
            }

            builderPanel.classList.remove('active');
            guidancePanel.classList.remove('active');

            if (panelType === 'builder') {
                builderPanel.classList.add('active');
                loadRoutines();
                renderProductShelf();
            } else {
                guidancePanel.classList.add('active');
                loadSchedule();
                generateRoutineTips();
            }
        }

        // Onboarding Functions
        function nextStep() {
            if (currentStep < 3) {
                // Validate current step
                if (currentStep === 0) {
                    const age = document.getElementById('age').value;
                    const gender = document.querySelector('input[name="gender"]:checked');
                    if (!age || !gender) {
                        alert('Please fill in all fields');
                        return;
                    }
                    userProfile.age = age;
                    userProfile.gender = gender.value;
                } else if (currentStep === 1) {
                    const goals = Array.from(document.querySelectorAll('#onboarding [data-step="1"] input[type="checkbox"]:checked'))
                        .map(cb => cb.value);
                    if (goals.length === 0) {
                        alert('Please select at least one goal');
                        return;
                    }
                    userProfile.goals = goals;
                } else if (currentStep === 2) {
                    const problems = Array.from(document.querySelectorAll('#onboarding [data-step="2"] input[type="checkbox"]:checked'))
                        .map(cb => cb.value);
                    userProfile.problems = problems;
                }

                document.querySelector(`.onboarding-step[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.remove('active');
                
                currentStep++;
                
                document.querySelector(`.onboarding-step[data-step="${currentStep}"]`).classList.add('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.add('active');
            }
        }

        function prevStep() {
            if (currentStep > 0) {
                document.querySelector(`.onboarding-step[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.remove('active');
                
                currentStep--;
                
                document.querySelector(`.onboarding-step[data-step="${currentStep}"]`).classList.add('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.add('active');
            }
        }

        function completeOnboarding() {
            localStorage.setItem('betterskin-profile', JSON.stringify(userProfile));
            showSection('routines');
            loadRoutines();
        }

        function selectRadio(element, name) {
            document.querySelectorAll(`.radio-item`).forEach(item => {
                if (item.querySelector(`input[name="${name}"]`)) {
                    item.classList.remove('selected');
                }
            });
            element.classList.add('selected');
            element.querySelector('input').checked = true;
        }

        function toggleCheckbox(element) {
            element.classList.toggle('selected');
            const checkbox = element.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
        }

        // Routine Functions
        function showRoutine(routineType, element) {
            currentRoutine = routineType;
            document.querySelectorAll('.routine-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.routine-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (element) {
                element.classList.add('active');
            }
            document.getElementById(`${routineType}-routine`).classList.add('active');
            loadRoutines();
        }

        function loadRoutines() {
            // Ensure routine is organized before displaying
            if (routines[currentRoutine]) {
                routines[currentRoutine] = organizeRoutineProducts(routines[currentRoutine]);
            }

            const morningBase = [
                { name: 'Cleanser', key: 'cleanser' },
                { name: 'Toner', key: 'toner' },
                { name: 'Serum', key: 'serum' },
                { name: 'Moisturizer', key: 'moisturizer' },
                { name: 'Sunscreen', key: 'sunscreen' },
                { name: 'Eye Cream', key: 'eye-cream' }
            ];

            const eveningBase = [
                { name: 'Cleanser', key: 'cleanser' },
                { name: 'Toner', key: 'toner' },
                { name: 'Serum', key: 'serum' },
                { name: 'Moisturizer', key: 'moisturizer' },
                { name: 'Eye Cream', key: 'eye-cream' }
            ];

            // Use the correct order based on category priority
            const stepOrder = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];
            let routineSteps = currentRoutine === 'morning' ? [...morningBase] : [...eveningBase];

            const currentData = routines[currentRoutine] || {};
            const existingKeys = new Set(routineSteps.map(step => step.key));

            // Add any custom steps that exist
            Object.keys(currentData).forEach(key => {
                if (!existingKeys.has(key) && stepOrder.includes(key)) {
                    // Insert in correct position based on order
                    const insertIndex = stepOrder.indexOf(key);
                    if (insertIndex !== -1) {
                        routineSteps.splice(insertIndex, 0, {
                            name: getStepLabel(key),
                            key
                        });
                    } else {
                    routineSteps.push({
                        name: getStepLabel(key),
                        key
                    });
                }
                } else if (!existingKeys.has(key)) {
                    routineSteps.push({
                        name: getStepLabel(key),
                        key
                    });
                }
            });

            // Re-sort routineSteps to match the correct order
            routineSteps.sort((a, b) => {
                const aIndex = stepOrder.indexOf(a.key);
                const bIndex = stepOrder.indexOf(b.key);
                if (aIndex === -1 && bIndex === -1) return 0;
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });

            const stepsContainer = document.getElementById(`${currentRoutine}-steps`);
            stepsContainer.innerHTML = '';

            // Get suggestions for missing mandatory products
            const suggestions = getMandatoryProductSuggestions(currentRoutine);

            // Show suggestions at the top if any
            if (suggestions.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'routine-suggestions';
                suggestionsDiv.style.cssText = 'background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 8px;';
                suggestionsDiv.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 8px; color: var(--text);">Recommendations:</div>
                    ${suggestions.map(s => `
                        <div style="font-size: 0.9rem; color: var(--text); margin-bottom: 4px;">
                            • ${s.message}
                        </div>
                    `).join('')}
                `;
                stepsContainer.appendChild(suggestionsDiv);
            }

            routineSteps.forEach(step => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'routine-step';
                
                const products = (routines[currentRoutine] && routines[currentRoutine][step.key]) ? routines[currentRoutine][step.key] : [];
                
                // Get frequency suggestions for active ingredients
                let frequencyNote = '';
                if (step.key === 'serum' && products.length > 0) {
                    products.forEach(product => {
                        const serumType = detectSerumType(product.name, product.category);
                        if (serumType === 'retinoid' && !product.frequencyNote) {
                            frequencyNote = '<div style="font-size: 0.85rem; color: var(--muted); margin-top: 8px; font-style: italic;">Tip: Start with 2-3 times per week, gradually increase to daily use as tolerated</div>';
                        } else if (serumType === 'aha' && !product.frequencyNote) {
                            frequencyNote = '<div style="font-size: 0.85rem; color: var(--muted); margin-top: 8px; font-style: italic;">Tip: Use 2-3 times per week</div>';
                        } else if (serumType === 'bha' && !product.frequencyNote) {
                            frequencyNote = '<div style="font-size: 0.85rem; color: var(--muted); margin-top: 8px; font-style: italic;">Tip: Use 2-3 times per week</div>';
                        }
                    });
                }
                
                const productsList = products.length > 0 ? 
                    `<ul class="product-list" id="${currentRoutine}-${step.key}-products">
                        ${products.map((product, index) => `
                            <li class="product-item">
                                <div class="product-info">
                                    <div class="product-name">${escapeHtml(product.name)}</div>
                                    <div class="product-category">${escapeHtml(product.category || step.key)}</div>
                                </div>
                                <div class="product-actions">
                                    <button class="btn-remove" onclick="removeProduct('${step.key}', ${index})">Remove</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>${frequencyNote}` : '';
                
                stepDiv.innerHTML = `
                    <div class="routine-step-header">
                        <span class="step-name">${step.name}</span>
                        <button class="add-product-btn" onclick="openProductModal('${step.key}')">+ Add Product</button>
                    </div>
                    ${productsList}
                `;
                stepsContainer.appendChild(stepDiv);
            });
        }

        function getStepLabel(stepKey) {
            return stepKey
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        }

        function renderProductShelf() {
            const shelfContainer = document.getElementById('product-shelf');
            if (!shelfContainer) return;

            // Collect all unique products from both routines
            const productMap = new Map();

            ['morning', 'evening'].forEach(routineKey => {
                const routine = routines[routineKey] || {};
                Object.keys(routine).forEach(stepKey => {
                    const products = routine[stepKey] || [];
                    products.forEach(product => {
                        const key = product.name.toLowerCase();
                        if (!productMap.has(key)) {
                            productMap.set(key, {
                                ...product, // Store all product data
                                routines: new Set()
                            });
                        }
                        productMap.get(key).routines.add(routineKey);
                    });
                });
            });

            shelfContainer.innerHTML = '';

            if (productMap.size === 0) {
                shelfContainer.innerHTML = '<div class="shelf-empty">Your shelf is empty. Add products to see them here.</div>';
                return;
            }

            // Sort products by name
            const sortedProducts = Array.from(productMap.values()).sort((a, b) => 
                a.name.localeCompare(b.name)
            );

            sortedProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'shelf-product-card';
                
                const routinesList = Array.from(product.routines);
                const routinesBadges = routinesList.map(r => 
                    `<span class="routine-badge">${r === 'morning' ? 'AM' : 'PM'}</span>`
                ).join('');

                const categoryLabel = getStepLabel(product.category);
                const initial = product.name.charAt(0).toUpperCase();
                
                const imageDiv = document.createElement('div');
                imageDiv.className = 'shelf-product-image';
                
                if (product.imageUrl) {
                    const img = document.createElement('img');
                    img.src = product.imageUrl;
                    img.alt = product.name;
                    img.onerror = function() {
                        this.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.textContent = initial;
                        imageDiv.appendChild(placeholder);
                    };
                    imageDiv.appendChild(img);
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.textContent = initial;
                    imageDiv.appendChild(placeholder);
                }

                // Calculate percentage
                const percentage = product.percentageLeft !== undefined ? product.percentageLeft : 100;
                const percentageClass = percentage <= 20 ? 'critical' : (percentage <= 40 ? 'low' : '');

                card.innerHTML = `
                    <div class="shelf-product-info">
                        <div class="shelf-product-name">${escapeHtml(product.name)}</div>
                        <div class="shelf-product-category">${categoryLabel}</div>
                        <div class="shelf-product-routines">${routinesBadges}</div>
                        <div class="shelf-product-percentage">
                            <div class="shelf-percentage-bar">
                                <div class="shelf-percentage-fill ${percentageClass}" style="width: ${percentage}%"></div>
                            </div>
                            <div class="shelf-percentage-text">${percentage}% remaining</div>
                        </div>
                        <button class="shelf-delete-btn" data-product-name="${escapeHtml(product.name)}" onclick="event.stopPropagation(); event.preventDefault(); const btn = event.target.closest('.shelf-delete-btn'); deleteProductFromShelf(btn.dataset.productName);" title="Delete product">
                            ×
                        </button>
                    </div>
                `;
                card.insertBefore(imageDiv, card.firstChild);
                card.style.cursor = 'pointer';
                card.onclick = () => showProductDetail(product);
                shelfContainer.appendChild(card);
            });
        }

        function showProductDetail(product) {
            const modal = document.getElementById('product-detail-modal');
            const body = document.getElementById('product-detail-body');
            
            if (!modal || !body) return;

            const categoryLabel = getStepLabel(product.category || '');
            const routinesList = Array.from(product.routines || []);
            const routinesText = routinesList.map(r => r === 'morning' ? 'Morning' : 'Evening').join(' & ');
            
            // Generate personalized highlights
            const highlights = generateProductHighlights(product);
            
            // Format ingredients
            const ingredients = product.ingredients || [];
            const ingredientsHtml = ingredients.length > 0 
                ? `<div class="ingredients-list">
                    ${ingredients.map(ing => `<span class="ingredient-tag">${escapeHtml(ing)}</span>`).join('')}
                   </div>`
                : '<p class="product-info-text" style="color: var(--muted); font-style: italic;">No ingredients listed</p>';
            
            // Format allergens
            const allergens = product.allergens || [];
            const allergensHtml = allergens.length > 0
                ? `<div class="allergen-warning">
                    ${allergens.map(allergen => `
                        <div class="allergen-item">
                            <span>Warning:</span>
                            <span>${escapeHtml(allergen)}</span>
                        </div>
                    `).join('')}
                   </div>`
                : '<p class="product-info-text" style="color: var(--muted); font-style: italic;">No known allergens</p>';
            
            // Product image
            const initial = product.name ? product.name.charAt(0).toUpperCase() : '?';
            const imageHtml = product.imageUrl
                ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name || '')}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display:none;">${escapeHtml(initial)}</div>`
                : `<div>${escapeHtml(initial)}</div>`;

            body.innerHTML = `
                <div class="product-detail-header">
                    <div class="product-detail-image">${imageHtml}</div>
                    <div class="product-detail-title">
                        <div class="product-detail-name">${escapeHtml(product.name)}</div>
                        <div class="product-detail-category">${categoryLabel}</div>
                        <div class="product-highlights">
                            ${highlights.map(h => `<span class="highlight-badge ${h.match ? 'match' : ''}">${escapeHtml(h.text)}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="product-detail-section">
                    <h3>Routine Usage</h3>
                    <p class="product-info-text">Used in: <strong>${routinesText}</strong> routine${routinesList.length > 1 ? 's' : ''}</p>
                </div>

                <div class="product-detail-section">
                    <h3>Ingredients</h3>
                    ${ingredientsHtml}
                </div>

                <div class="product-detail-section">
                    <h3>Allergens & Warnings</h3>
                    ${allergensHtml}
                </div>

                ${product.notes ? `
                <div class="product-detail-section">
                    <h3>Notes</h3>
                    <p class="product-info-text">${escapeHtml(product.notes)}</p>
                </div>
                ` : ''}

                <div class="product-detail-section">
                    <h3>Product Image</h3>
                    <div class="form-group" style="margin-bottom: 0;">
                        <input type="url" id="product-image-url-input" 
                               value="${product.imageUrl || ''}" 
                               placeholder="https://example.com/product-image.jpg"
                               style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
                        <button class="btn btn-primary" 
                                onclick="updateProductImage('${escapeHtml(product.name)}')" 
                                style="margin-top: 8px; width: 100%;">
                            Update Image URL
                        </button>
                    </div>
                </div>

                <div class="product-detail-section">
                    <h3>Product Usage</h3>
                    <div class="product-usage-container">
                        <div class="product-usage-bar-wrapper">
                            <div class="product-usage-bar">
                                <div class="product-usage-fill ${(product.percentageLeft || 100) <= 20 ? 'critical' : (product.percentageLeft || 100) <= 40 ? 'low' : ''}" 
                                     style="width: ${product.percentageLeft || 100}%"></div>
                            </div>
                            <div class="product-usage-text">${product.percentageLeft || 100}% remaining</div>
                        </div>
                        <div class="product-usage-controls">
                            <input type="number" id="product-percentage-input" min="0" max="100" value="${product.percentageLeft || 100}" 
                                   onchange="updateProductPercentage('${escapeHtml(product.name)}', this.value)"
                                   style="width: 80px; padding: 8px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                            <span style="color: var(--muted); font-size: 0.9rem;">%</span>
                        </div>
                        ${(product.percentageLeft || 100) <= 20 ? `
                        <div class="product-refill-warning">
                            <span>Warning:</span>
                            <span>Time to refill! Product is running low.</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="product-detail-actions">
                    <button class="btn btn-danger" onclick="deleteProductFromShelf('${escapeHtml(product.name)}')">Delete Product</button>
                </div>
            `;

            // Store product reference for updates
            modal.dataset.productName = product.name;
            modal.classList.add('active');
        }

        function closeProductDetailModal() {
            const modal = document.getElementById('product-detail-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        }

        async function updateProductPercentage(productName, percentage) {
            const percentageNum = parseInt(percentage);
            if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
                alert('Please enter a valid percentage between 0 and 100');
                return;
            }

            // Find and update product in all routines
            let updated = false;
            ['morning', 'evening'].forEach(routineKey => {
                const routine = routines[routineKey] || {};
                Object.keys(routine).forEach(stepKey => {
                    const products = routine[stepKey] || [];
                    products.forEach(product => {
                        if (product.name.toLowerCase() === productName.toLowerCase()) {
                            product.percentageLeft = percentageNum;
                            updated = true;
                        }
                    });
                });
            });

            if (updated) {
                await saveRoutinesToSupabase(routines);
                // Refresh the product detail modal
                const modal = document.getElementById('product-detail-modal');
                if (modal && modal.classList.contains('active')) {
                    // Find the product again to refresh the view
                    const productMap = new Map();
                    ['morning', 'evening'].forEach(routineKey => {
                        const routine = routines[routineKey] || {};
                        Object.keys(routine).forEach(stepKey => {
                            const products = routine[stepKey] || [];
                            products.forEach(product => {
                                const key = product.name.toLowerCase();
                                if (!productMap.has(key)) {
                                    productMap.set(key, {
                                        ...product,
                                        routines: new Set()
                                    });
                                }
                                productMap.get(key).routines.add(routineKey);
                            });
                        });
                    });
                    const updatedProduct = productMap.get(productName.toLowerCase());
                    if (updatedProduct) {
                        showProductDetail(updatedProduct);
                    }
                }
                renderProductShelf();
                renderSummary(); // Update reminders
            }
        }

        async function updateProductImage(productName) {
            const imageUrlInput = document.getElementById('product-image-url-input');
            if (!imageUrlInput) return;

            const imageUrl = imageUrlInput.value.trim();

            // Find and update product in all routines
            let updated = false;
            ['morning', 'evening'].forEach(routineKey => {
                const routine = routines[routineKey] || {};
                Object.keys(routine).forEach(stepKey => {
                    const products = routine[stepKey] || [];
                    products.forEach(product => {
                        if (product.name.toLowerCase() === productName.toLowerCase()) {
                            product.imageUrl = imageUrl || null;
                            updated = true;
                        }
                    });
                });
            });

            if (updated) {
                await saveRoutinesToSupabase(routines);
                
                // Update schedule if it exists
                if (weekSchedule && weekSchedule.length > 0) {
                    weekSchedule.forEach(daySchedule => {
                        daySchedule.morning.forEach(p => {
                            if (p.name.toLowerCase() === productName.toLowerCase()) {
                                p.imageUrl = imageUrl || null;
                            }
                        });
                        daySchedule.evening.forEach(p => {
                            if (p.name.toLowerCase() === productName.toLowerCase()) {
                                p.imageUrl = imageUrl || null;
                            }
                        });
                    });
                    await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
                }
                
                // Refresh the product detail modal
                const modal = document.getElementById('product-detail-modal');
                if (modal && modal.classList.contains('active')) {
                    // Find the product again to refresh the view
                    const productMap = new Map();
                    ['morning', 'evening'].forEach(routineKey => {
                        const routine = routines[routineKey] || {};
                        Object.keys(routine).forEach(stepKey => {
                            const products = routine[stepKey] || [];
                            products.forEach(product => {
                                const key = product.name.toLowerCase();
                                if (!productMap.has(key)) {
                                    productMap.set(key, {
                                        ...product,
                                        routines: new Set()
                                    });
                                }
                                productMap.get(key).routines.add(routineKey);
                            });
                        });
                    });
                    const updatedProduct = productMap.get(productName.toLowerCase());
                    if (updatedProduct) {
                        showProductDetail(updatedProduct);
                    }
                }
                renderProductShelf();
                await loadSchedule();
                
                // Show success message
                const message = document.createElement('div');
                message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--accent); color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;';
                message.textContent = 'Product image updated';
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
            }
        }

        async function deleteProductFromShelf(productName) {
            // Decode HTML entities in case they were escaped
            const decodedName = productName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            
            if (!confirm(`Are you sure you want to delete "${decodedName}" from all routines?`)) {
                return;
            }

            // Ensure routines structure exists
            if (!routines.morning) routines.morning = {};
            if (!routines.evening) routines.evening = {};

            // Remove product from all routines
            let deleted = false;
            let totalRemoved = 0;
            
            ['morning', 'evening'].forEach(routineKey => {
                if (!routines[routineKey]) {
                    routines[routineKey] = {};
                }
                const routine = routines[routineKey];
                
                Object.keys(routine).forEach(stepKey => {
                    if (!Array.isArray(routine[stepKey])) {
                        routine[stepKey] = [];
                    }
                    const products = routine[stepKey];
                    const beforeCount = products.length;
                    
                    // Filter out the product with case-insensitive matching
                    const targetNameLower = decodedName.toLowerCase().trim();
                    const filtered = products.filter(product => {
                        if (!product || !product.name) return true;
                        const productNameLower = (product.name || '').toLowerCase().trim();
                        return productNameLower !== targetNameLower;
                    });
                    
                    const afterCount = filtered.length;
                    const removed = beforeCount - afterCount;
                    
                    if (removed > 0) {
                        routine[stepKey] = filtered;
                        deleted = true;
                        totalRemoved += removed;
                    }
                });
            });

            if (deleted) {
                await saveRoutinesToSupabase(routines);
                
                // Remove product from schedule if schedule exists
                if (weekSchedule && weekSchedule.length > 0) {
                    let scheduleUpdated = false;
                    weekSchedule.forEach(daySchedule => {
                        const morningBefore = daySchedule.morning.length;
                        const eveningBefore = daySchedule.evening.length;
                        
                        // Remove from morning
                        daySchedule.morning = daySchedule.morning.filter(p => {
                            const pName = (p.name || '').toLowerCase().trim();
                            return pName !== decodedName.toLowerCase().trim();
                        });
                        
                        // Remove from evening
                        daySchedule.evening = daySchedule.evening.filter(p => {
                            const pName = (p.name || '').toLowerCase().trim();
                            return pName !== decodedName.toLowerCase().trim();
                        });
                        
                        // Remove from completed lists
                        daySchedule.completed.morning = daySchedule.completed.morning.filter(id => {
                            const product = daySchedule.morning.find(p => p.id === id);
                            return product !== undefined;
                        });
                        daySchedule.completed.evening = daySchedule.completed.evening.filter(id => {
                            const product = daySchedule.evening.find(p => p.id === id);
                            return product !== undefined;
                        });
                        
                        if (morningBefore !== daySchedule.morning.length || eveningBefore !== daySchedule.evening.length) {
                            scheduleUpdated = true;
                        }
                    });
                    
                    if (scheduleUpdated) {
                        await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
                    }
                }
                
                closeProductDetailModal();
                
                // Use the already-modified routines object (don't reload from Supabase to avoid stale data)
                // The routines variable has already been updated with the deletion
                
                // Ensure structure is correct
                if (!routines.evening) routines.evening = {};
                if (!routines.morning) routines.morning = {};
                
                // Reload displays - this is critical!
                loadRoutines(); // This reads from the routines variable and updates the DOM
                renderProductShelf(); // This also reads from routines variable
                await loadSchedule(); // Reload schedule to reflect deletion
                renderSummary();
                
                // Show success message
                const message = document.createElement('div');
                message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--accent); color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;';
                message.textContent = `Product "${decodedName}" deleted`;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
            } else {
                alert(`Product "${decodedName}" not found in routines.`);
            }
        }

        // Cleanup function to remove products from routines that aren't in the digital shelf
        async function cleanupOrphanedProducts() {
            // Build the product map from routines (same logic as renderProductShelf)
            const productMap = new Map();
            
            ['morning', 'evening'].forEach(routineKey => {
                const routine = routines[routineKey] || {};
                Object.keys(routine).forEach(stepKey => {
                    const products = routine[stepKey] || [];
                    products.forEach(product => {
                        if (product && product.name) {
                            const key = product.name.toLowerCase().trim();
                            if (!productMap.has(key)) {
                                productMap.set(key, product);
                            }
                        }
                    });
                });
            });
            
            // Get all product names that should be in the shelf
            const shelfProductNames = new Set(Array.from(productMap.keys()));
            
            // Now remove any products from routines that don't match what's in the shelf
            // This handles cases where products might have been partially deleted or have inconsistencies
            let cleaned = false;
            const productsToRemove = [];
            
            ['morning', 'evening'].forEach(routineKey => {
                if (!routines[routineKey]) {
                    routines[routineKey] = {};
                }
                const routine = routines[routineKey];
                
                Object.keys(routine).forEach(stepKey => {
                    if (!Array.isArray(routine[stepKey])) {
                        routine[stepKey] = [];
                    }
                    const products = routine[stepKey];
                    
                    const filtered = products.filter(product => {
                        if (!product || !product.name) {
                            return false; // Remove invalid products
                        }
                        const productKey = product.name.toLowerCase().trim();
                        const shouldKeep = shelfProductNames.has(productKey);
                        
                        if (!shouldKeep) {
                            productsToRemove.push(product.name);
                        }
                        
                        return shouldKeep;
                    });
                    
                    if (filtered.length !== products.length) {
                        routine[stepKey] = filtered;
                        cleaned = true;
                    }
                });
            });
            
            if (cleaned) {
                await saveRoutinesToSupabase(routines);
                loadRoutines();
                renderProductShelf();
                renderSummary();
                
                if (productsToRemove.length > 0) {
                    const uniqueRemoved = [...new Set(productsToRemove)];
                    console.log('Cleaned up orphaned products:', uniqueRemoved);
                }
            }
            
            return cleaned;
        }
        
        // Function to remove specific products from routines by name (case-insensitive)
        async function removeProductsFromRoutines(productNames) {
            if (!Array.isArray(productNames)) {
                productNames = [productNames];
            }
            
            // Get the actual routines object from state manager to modify it properly
            const currentRoutines = stateManager.getState('routines');
            let removed = false;
            const removedProducts = [];
            
            // Ensure routines structure exists
            if (!currentRoutines.morning) currentRoutines.morning = {};
            if (!currentRoutines.evening) currentRoutines.evening = {};
            
            ['morning', 'evening'].forEach(routineKey => {
                if (!currentRoutines[routineKey]) {
                    currentRoutines[routineKey] = {};
                }
                const routine = currentRoutines[routineKey];
                
                Object.keys(routine).forEach(stepKey => {
                    if (!Array.isArray(routine[stepKey])) {
                        routine[stepKey] = [];
                    }
                    const products = routine[stepKey];
                    
                    const targetNamesLower = productNames.map(name => name.toLowerCase().trim());
                    
                    const filtered = products.filter(product => {
                        if (!product || !product.name) {
                            return false;
                        }
                        const productNameLower = product.name.toLowerCase().trim();
                        const nameMatches = targetNamesLower.includes(productNameLower);
                        
                        // Only remove products that match the name AND don't have photos (no imageUrl)
                        const shouldRemove = nameMatches && !product.imageUrl;
                        
                        if (shouldRemove) {
                            removedProducts.push(product.name);
                        }
                        
                        return !shouldRemove;
                    });
                    
                    if (filtered.length !== products.length) {
                        routine[stepKey] = filtered;
                        removed = true;
                    }
                });
            });
            
            if (removed) {
                // Update state manager with modified routines
                stateManager.setState({ routines: currentRoutines });
                await saveRoutinesToSupabase(currentRoutines);
                loadRoutines();
                renderProductShelf();
                renderSummary();
                
                const uniqueRemoved = [...new Set(removedProducts)];
                const message = document.createElement('div');
                message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--accent); color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;';
                message.textContent = `Removed ${uniqueRemoved.length} product(s) from routines`;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
            }
            
            return removed;
        }

        function generateProductHighlights(product) {
            const highlights = [];
            
            // Check age match
            if (userProfile.age) {
                const age = parseInt(userProfile.age);
                if (product.targetAge) {
                    const [minAge, maxAge] = product.targetAge.split('-').map(Number);
                    if (age >= minAge && age <= maxAge) {
                        highlights.push({ text: 'Best match for your age', match: true });
                    }
                } else if (age >= 25 && age <= 35) {
                    // Default: good for most age groups
                    highlights.push({ text: 'Suitable for your age group', match: true });
                }
            }
            
            // Check skin type match
            if (userProfile.skinType && product.suitableForSkinTypes) {
                const skinTypes = Array.isArray(product.suitableForSkinTypes) 
                    ? product.suitableForSkinTypes 
                    : [product.suitableForSkinTypes];
                if (skinTypes.includes(userProfile.skinType.toLowerCase())) {
                    highlights.push({ text: 'Perfect for your skin type', match: true });
                }
            }
            
            // Check goals match
            if (userProfile.goals && product.targetGoals) {
                const goals = Array.isArray(userProfile.goals) ? userProfile.goals : [userProfile.goals];
                const targetGoals = Array.isArray(product.targetGoals) ? product.targetGoals : [product.targetGoals];
                const matchingGoals = goals.filter(g => targetGoals.includes(g));
                if (matchingGoals.length > 0) {
                    highlights.push({ text: `Supports: ${matchingGoals.join(', ')}`, match: true });
                }
            }
            
            // Category-based highlights
            if (product.category === 'sunscreen') {
                highlights.push({ text: 'UV Protection', match: false });
            } else if (product.category === 'treatment') {
                highlights.push({ text: 'Active Treatment', match: false });
            } else if (product.category === 'serum') {
                highlights.push({ text: 'Concentrated Formula', match: false });
            }
            
            // If no highlights, add a default
            if (highlights.length === 0) {
                highlights.push({ text: '📦 In your routine', match: false });
            }
            
            return highlights;
        }

        function loadProductsForStep(stepKey) {
            const products = routines[currentRoutine][stepKey] || [];
            const productsList = document.getElementById(`${currentRoutine}-${stepKey}-products`);
            productsList.innerHTML = '';

            products.forEach((product, index) => {
                const li = document.createElement('li');
                li.className = 'product-item';
                li.innerHTML = `
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-category">${product.category}</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-remove" onclick="removeProduct('${stepKey}', ${index})">Remove</button>
                    </div>
                `;
                productsList.appendChild(li);
            });
        }

        function openProductModal(stepKey) {
            currentStepType = stepKey;
            document.getElementById('product-modal').classList.add('active');
            document.getElementById('product-name').value = '';
            document.getElementById('product-category').value = stepKey;
            document.getElementById('product-image').value = '';
            document.getElementById('product-percentage').value = '100';
            
            // Update routine checkboxes based on category
            updateRoutineCheckboxesForCategory(stepKey);
            
            // Add event listener to category dropdown if not already added
            const categorySelect = document.getElementById('product-category');
            if (categorySelect && !categorySelect.dataset.listenerAdded) {
                categorySelect.addEventListener('change', function() {
                    updateRoutineCheckboxesForCategory(this.value);
                });
                categorySelect.dataset.listenerAdded = 'true';
            }
        }
        
        function updateRoutineCheckboxesForCategory(category) {
            const morningToggle = document.getElementById('apply-morning');
            const eveningToggle = document.getElementById('apply-evening');
            
            if (!morningToggle || !eveningToggle) return;
            
            // Set defaults based on category rules
            if (category === 'cleanser') {
                // Cleanser: default to both, but evening is required
                morningToggle.checked = currentRoutine === 'morning' || true;
                eveningToggle.checked = true; // Always required
                eveningToggle.disabled = true; // Can't uncheck evening for cleanser
            } else if (category === 'sunscreen') {
                // SPF: morning only
                morningToggle.checked = true;
                eveningToggle.checked = false;
                morningToggle.disabled = false;
                eveningToggle.disabled = true; // Can't check evening for SPF
            } else if (category === 'moisturizer') {
                // Moisturizer: both
                morningToggle.checked = true;
                        eveningToggle.checked = true;
                morningToggle.disabled = false;
                eveningToggle.disabled = false;
                    } else {
                // Other categories: default to current routine
                morningToggle.checked = currentRoutine === 'morning';
                eveningToggle.checked = currentRoutine === 'evening';
                morningToggle.disabled = false;
                eveningToggle.disabled = false;
            }
        }

        function closeModal() {
            document.getElementById('product-modal').classList.remove('active');
        }

        // ========== ROUTINE BUILDING LOGIC ==========
        
        // Detect serum type from product name
        function detectSerumType(productName, category) {
            if (category !== 'serum') return null;
            
            const name = productName.toLowerCase();
            
            // Vitamin C
            if (name.includes('vitamin c') || name.includes('vit c') || name.includes('ascorbic acid') || name.includes('l-ascorbic')) {
                return 'vitamin-c';
            }
            
            // Retinoids
            if (name.includes('retinol') || name.includes('retinal') || name.includes('retinaldehyde') || 
                name.includes('tretinoin') || name.includes('retin-a') || name.includes('retinoid')) {
                return 'retinoid';
            }
            
            // Hyaluronic Acid
            if (name.includes('hyaluronic') || name.includes('hyaluron') || name.includes('ha serum') || name.includes('sodium hyaluronate')) {
                return 'hyaluronic-acid';
            }
            
            // Niacinamide
            if (name.includes('niacinamide') || name.includes('nicotinamide') || name.includes('vitamin b3')) {
                return 'niacinamide';
            }
            
            // AHAs
            if (name.includes('glycolic') || name.includes('lactic acid') || name.includes('mandelic acid') || 
                name.includes('aha') || name.includes('alpha hydroxy')) {
                return 'aha';
            }
            
            // BHAs / Salicylic Acid
            if (name.includes('salicylic') || name.includes('bha') || name.includes('beta hydroxy') || 
                name.includes('salicylic acid')) {
                return 'bha';
            }
            
            // Peptides
            if (name.includes('peptide') || name.includes('copper peptide') || name.includes('matrixyl') || 
                name.includes('argireline')) {
                return 'peptide';
            }
            
            // Benzoyl Peroxide
            if (name.includes('benzoyl peroxide') || name.includes('bp')) {
                return 'benzoyl-peroxide';
            }
            
            return 'other';
        }
        
        // Get serum layering order (lower number = earlier in routine)
        function getSerumLayeringOrder(serumType) {
            const order = {
                'hyaluronic-acid': 1,
                'peptide': 2,
                'niacinamide': 3,
                'vitamin-c': 4,
                'aha': 5,
                'bha': 5,
                'retinoid': 6,
                'benzoyl-peroxide': 6,
                'other': 3
            };
            return order[serumType] || 3;
        }
        
        // Check for product conflicts
        function checkProductConflicts(product, routineType, existingProducts) {
            const serumType = detectSerumType(product.name, product.category);
            const conflicts = [];
            
            if (serumType === 'vitamin-c') {
                // Vitamin C conflicts with Retinoids, AHAs, BHAs, Benzoyl Peroxide in evening
                if (routineType === 'evening') {
                    existingProducts.forEach(existing => {
                        const existingSerumType = detectSerumType(existing.name, existing.category);
                        if (['retinoid', 'aha', 'bha', 'benzoyl-peroxide'].includes(existingSerumType)) {
                            conflicts.push({
                                product: existing.name,
                                reason: 'Vitamin C should not be used with Retinoids, AHAs, BHAs, or Benzoyl Peroxide in the evening'
                            });
                        }
                    });
                }
            }
            
            if (serumType === 'retinoid') {
                // Retinoids conflict with Vitamin C, AHAs, BHAs, Benzoyl Peroxide
                existingProducts.forEach(existing => {
                    const existingSerumType = detectSerumType(existing.name, existing.category);
                    if (['vitamin-c', 'aha', 'bha', 'benzoyl-peroxide'].includes(existingSerumType)) {
                        conflicts.push({
                            product: existing.name,
                            reason: 'Retinoids should not be used with Vitamin C, AHAs, BHAs, or Benzoyl Peroxide'
                        });
                    }
                });
            }
            
            if (serumType === 'aha') {
                // AHAs conflict with BHAs and Retinoids
                existingProducts.forEach(existing => {
                    const existingSerumType = detectSerumType(existing.name, existing.category);
                    if (['bha', 'retinoid'].includes(existingSerumType)) {
                        conflicts.push({
                            product: existing.name,
                            reason: 'AHAs should not be used with BHAs or Retinoids'
                        });
                    }
                });
            }
            
            if (serumType === 'bha') {
                // BHAs conflict with AHAs and Retinoids
                existingProducts.forEach(existing => {
                    const existingSerumType = detectSerumType(existing.name, existing.category);
                    if (['aha', 'retinoid'].includes(existingSerumType)) {
                        conflicts.push({
                            product: existing.name,
                            reason: 'BHAs should not be used with AHAs or Retinoids'
                        });
                    }
                });
            }
            
            return conflicts;
        }
        
        // Determine which routines a product should go to based on category and type
        function determineRoutinePlacement(product, userSelectedMorning, userSelectedEvening) {
            const category = product.category;
            const serumType = detectSerumType(product.name, category);
            
            let shouldGoToMorning = userSelectedMorning;
            let shouldGoToEvening = userSelectedEvening;
            
            // Cleanser: Always goes to evening (mandatory), morning is optional (user can override)
            if (category === 'cleanser') {
                shouldGoToEvening = true; // Always required in evening, cannot be overridden
                // Morning can be user's choice, but defaults to true if not explicitly set
                if (userSelectedMorning === undefined) {
                    shouldGoToMorning = true;
                }
            }
            
            // SPF: Morning only (mandatory)
            if (category === 'sunscreen') {
                shouldGoToMorning = true;
                shouldGoToEvening = false;
            }
            
            // Vitamin C: Morning only (cannot be overridden)
            if (serumType === 'vitamin-c') {
                shouldGoToMorning = true;
                shouldGoToEvening = false;
            }
            
            // Retinoids: Evening only (cannot be overridden)
            if (serumType === 'retinoid') {
                shouldGoToMorning = false;
                shouldGoToEvening = true;
            }
            
            // AHAs: Evening only (cannot be overridden)
            if (serumType === 'aha') {
                shouldGoToMorning = false;
                shouldGoToEvening = true;
            }
            
            // BHAs: Evening preferred, but can go to morning if user explicitly wants
            if (serumType === 'bha') {
                shouldGoToMorning = userSelectedMorning === true; // Only if user explicitly checks
                shouldGoToEvening = userSelectedEvening !== false; // Default to true unless explicitly unchecked
            }
            
            // Moisturizer: Both (mandatory)
            if (category === 'moisturizer') {
                shouldGoToMorning = true;
                shouldGoToEvening = true;
            }
            
            return {
                morning: shouldGoToMorning,
                evening: shouldGoToEvening
            };
        }
        
        // Get the correct step key for a product based on category and existing routine structure
        function getStepKeyForProduct(product, routineType, existingRoutine) {
            const category = product.category;
            const serumType = detectSerumType(product.name, category);
            
            // Direct category mappings
            if (category === 'cleanser') return 'cleanser';
            if (category === 'toner') return 'toner';
            if (category === 'moisturizer') return 'moisturizer';
            if (category === 'sunscreen') return 'sunscreen';
            
            // Serums go into a 'serum' step, but we'll handle layering
            if (category === 'serum') {
                return 'serum';
            }
            
            // Other categories
            return category;
        }
        
        // Organize products in correct order for a routine
        function organizeRoutineProducts(routineProducts) {
            const order = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];
            const organized = {};
            
            // First, organize by step
            order.forEach(stepKey => {
                organized[stepKey] = routineProducts[stepKey] || [];
            });
            
            // Handle any other steps
            Object.keys(routineProducts).forEach(stepKey => {
                if (!order.includes(stepKey)) {
                    organized[stepKey] = routineProducts[stepKey];
                }
            });
            
            // Sort serums by layering order
            // Special rule: If both Niacinamide and Vitamin C are present, Vitamin C goes after Niacinamide
            if (organized.serum && organized.serum.length > 1) {
                organized.serum.sort((a, b) => {
                    const aType = detectSerumType(a.name, a.category);
                    const bType = detectSerumType(b.name, b.category);
                    
                    // Special case: Vitamin C after Niacinamide
                    if (aType === 'vitamin-c' && bType === 'niacinamide') return 1;
                    if (aType === 'niacinamide' && bType === 'vitamin-c') return -1;
                    
                    const aOrder = getSerumLayeringOrder(aType);
                    const bOrder = getSerumLayeringOrder(bType);
                    return aOrder - bOrder;
                });
            }
            
            return organized;
        }
        
        // Get suggestions for missing mandatory products
        function getMandatoryProductSuggestions(routineType) {
            const suggestions = [];
            const routine = routines[routineType] || {};
            
            // Check for cleanser (mandatory, especially in evening)
            if (!routine.cleanser || routine.cleanser.length === 0) {
                suggestions.push({
                    type: 'mandatory',
                    category: 'cleanser',
                    message: routineType === 'evening' 
                        ? 'Cleanser is required in evening routine' 
                        : 'Consider adding a cleanser to your morning routine'
                });
            }
            
            // Check for moisturizer (mandatory in both)
            if (!routine.moisturizer || routine.moisturizer.length === 0) {
                suggestions.push({
                    type: 'mandatory',
                    category: 'moisturizer',
                    message: 'Moisturizer is recommended for both morning and evening routines'
                });
            }
            
            // Check for SPF (mandatory in morning)
            if (routineType === 'morning' && (!routine.sunscreen || routine.sunscreen.length === 0)) {
                suggestions.push({
                    type: 'mandatory',
                    category: 'sunscreen',
                    message: 'SPF is essential in your morning routine, especially when using active ingredients'
                });
            }
            
            return suggestions;
        }
        
        async function addProduct() {
            const nameEl = document.getElementById('product-name');
            const categoryEl = document.getElementById('product-category');
            const imageUrlEl = document.getElementById('product-image');
            const percentageEl = document.getElementById('product-percentage');
            const morningToggle = document.getElementById('apply-morning');
            const eveningToggle = document.getElementById('apply-evening');
            
            if (!nameEl || !categoryEl) {
                alert('Form elements not found. Please refresh the page.');
                return;
            }
            
            const name = nameEl.value.trim();
            const category = categoryEl.value;
            const imageUrl = imageUrlEl ? imageUrlEl.value.trim() : '';
            const percentageLeft = percentageEl ? (parseInt(percentageEl.value) || 100) : 100;
            const applyMorning = morningToggle ? morningToggle.checked : false;
            const applyEvening = eveningToggle ? eveningToggle.checked : false;

            if (!name) {
                alert('Please enter a product name');
                return;
            }

            if (!category) {
                alert('Please select a category');
                return;
            }

            if (!routines) {
                routines = { morning: {}, evening: {} };
            }

            // Create product object
            const product = {
                name,
                category,
                imageUrl: imageUrl || null,
                percentageLeft: percentageLeft
            };
            
            // Determine routine placement based on product type and rules
            const placement = determineRoutinePlacement(product, applyMorning, applyEvening);
            
            // Override for cleanser: always add to evening even if user didn't select it
            if (category === 'cleanser') {
                placement.evening = true;
            }
            
            // Validate that at least one routine is selected
            if (!placement.morning && !placement.evening) {
                alert('Please select at least one routine (Morning and/or Evening)');
                return;
            }
            
            // Check for conflicts before adding
            const targets = [];
            if (placement.morning) targets.push('morning');
            if (placement.evening) targets.push('evening');

            let conflictsFound = [];
            targets.forEach(routineKey => {
                if (!routines[routineKey]) {
                    routines[routineKey] = {};
                }
                
                // Get all existing products in this routine for conflict checking
                const allExistingProducts = [];
                Object.keys(routines[routineKey]).forEach(stepKey => {
                    if (routines[routineKey][stepKey] && Array.isArray(routines[routineKey][stepKey])) {
                        allExistingProducts.push(...routines[routineKey][stepKey]);
                    }
                });
                
                const conflicts = checkProductConflicts(product, routineKey, allExistingProducts);
                if (conflicts.length > 0) {
                    conflictsFound.push(...conflicts.map(c => ({ routine: routineKey, ...c })));
                }
            });
            
            // Show conflicts if any
            if (conflictsFound.length > 0) {
                const conflictMessages = conflictsFound.map(c => 
                    `${c.routine}: ${c.product} - ${c.reason}`
                ).join('\n');
                
                const proceed = confirm(
                    `Warning: Product conflicts detected:\n\n${conflictMessages}\n\nDo you want to proceed anyway?`
                );
                if (!proceed) {
                    return;
                }
            }
            
            // Get step key for the product
            const stepType = getStepKeyForProduct(product, 'morning', routines.morning);
            
            let addedToRoutines = [];
            let alreadyExists = false;

            // Add product to each routine
            targets.forEach(routineKey => {
                if (!routines[routineKey]) {
                    routines[routineKey] = {};
                }
                
                // Get the correct step for this routine
                const routineStepType = getStepKeyForProduct(product, routineKey, routines[routineKey]);
                
                if (!routines[routineKey][routineStepType]) {
                    routines[routineKey][routineStepType] = [];
                }

                // Check if product already exists in this step
                const exists = routines[routineKey][routineStepType]
                    .some(p => p.name.toLowerCase() === name.toLowerCase());

                if (exists) {
                    alreadyExists = true;
                } else {
                    // Add the product
                    routines[routineKey][routineStepType].push(product);
                    addedToRoutines.push(routineKey);
                }
            });
            
            // Organize all routines to ensure correct order
            ['morning', 'evening'].forEach(routineKey => {
                if (routines[routineKey]) {
                    routines[routineKey] = organizeRoutineProducts(routines[routineKey]);
                }
            });

            if (alreadyExists && addedToRoutines.length === 0) {
                alert('This product is already added to all selected routine steps');
                return;
            }

            if (addedToRoutines.length === 0) {
                return;
            }

            await saveRoutinesToSupabase(routines);
            
            // Force reload schedule and update with new products
            // First ensure schedule is loaded
            if (!weekSchedule || weekSchedule.length === 0) {
                const scheduleData = await loadScheduleFromSupabase();
                if (scheduleData && scheduleData.schedule && scheduleData.schedule.length > 0) {
                    weekSchedule = scheduleData.schedule;
                    scheduleStartDate = scheduleData.startDate;
                }
            }
            
            // Update schedule with new products if schedule exists
            if (weekSchedule && weekSchedule.length > 0) {
                try {
                    await updateScheduleWithNewProducts();
                    // Reload the schedule display
                    await loadSchedule();
                } catch (error) {
                    // Error handled by updateScheduleWithNewProducts
                }
            }
            
            // Show success message
            const routineNames = addedToRoutines.map(r => r === 'morning' ? 'Morning' : 'Evening').join(' and ');
            const stepName = getStepLabel(stepType);
            const message = document.createElement('div');
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--accent); color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;';
            message.textContent = `Added to ${routineNames} routine${addedToRoutines.length > 1 ? 's' : ''} - ${stepName}`;
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
            
            loadRoutines();
            renderProductShelf();
            closeModal();
            renderSummary();
            
            // If schedule exists, reload it to show new products
            if (weekSchedule && weekSchedule.length > 0) {
                await loadSchedule();
            }
        }

        async function removeProduct(stepKey, index) {
            if (!routines[currentRoutine][stepKey]) {
                return;
            }
            const removedProduct = routines[currentRoutine][stepKey][index];
            routines[currentRoutine][stepKey].splice(index, 1);
            await saveRoutinesToSupabase(routines);
            
            // Update schedule to remove the product if schedule exists
            if (weekSchedule && weekSchedule.length > 0 && removedProduct) {
                await updateScheduleAfterProductRemoval(removedProduct, currentRoutine);
            }
            
            loadRoutines();
            renderProductShelf();
            renderSummary();
        }

        function loadSuggestions() {
            const suggestionsContainer = document.getElementById('tips-content');
            if (!suggestionsContainer) {
                return;
            }

            suggestionsContainer.classList.remove('tips-content-empty');
            suggestionsContainer.innerHTML = '';

            if (!userProfile.goals || userProfile.goals.length === 0) {
                suggestionsContainer.classList.add('tips-content-empty');
                suggestionsContainer.textContent = 'Complete your goals to unlock targeted product inspiration.';
                return;
            }

            const suggestions = getProductSuggestions();
            
            if (suggestions.length === 0) {
                suggestionsContainer.classList.add('tips-content-empty');
                suggestionsContainer.textContent = 'All current steps cover your goals. Add new concerns to see more suggestions.';
                return;
            }

            const suggestionsBox = document.createElement('div');
            suggestionsBox.className = 'suggestions-box';
            suggestionsBox.innerHTML = `<p class="microcopy" style="margin-bottom:12px;">Focusing on your ${currentRoutine} routine.</p>`;
            
            suggestions.forEach(suggestion => {
                // Check if product already exists in routine
                const exists = checkProductExists(suggestion.category, suggestion.name);
                if (!exists) {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.className = 'suggestion-item';
                    suggestionDiv.innerHTML = `
                        <div>
                            <strong>${suggestion.name}</strong>
                            <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">${suggestion.category} - ${suggestion.reason}</div>
                        </div>
                        <button class="btn-add-suggestion" onclick="addSuggestedProduct('${suggestion.category}', '${suggestion.name}')">Add</button>
                    `;
                    suggestionsBox.appendChild(suggestionDiv);
                }
            });
            
            if (suggestionsBox.children.length === 0) {
                suggestionsContainer.classList.add('tips-content-empty');
                suggestionsContainer.textContent = 'Looks like you already use every suggested product for this routine.';
                return;
            }

            suggestionsContainer.appendChild(suggestionsBox);
        }

        function getProductSuggestions() {
            const suggestions = [];
            const goals = userProfile.goals || [];
            const problems = userProfile.problems || [];

            // Anti-aging suggestions
            if (goals.includes('anti-aging') || problems.includes('fine-lines') || problems.includes('wrinkles')) {
                if (currentRoutine === 'morning') {
                    suggestions.push({
                        name: 'Vitamin C Serum',
                        category: 'serum',
                        reason: 'Helps with collagen production and protects against free radicals'
                    });
                } else {
                    suggestions.push({
                        name: 'Retinol Serum',
                        category: 'treatment',
                        reason: 'Gold standard for anti-aging, promotes cell turnover'
                    });
                }
                suggestions.push({
                    name: 'Peptide Moisturizer',
                    category: 'moisturizer',
                    reason: 'Supports skin elasticity and firmness'
                });
            }

            // Acne treatment
            if (goals.includes('acne-treatment') || problems.includes('acne')) {
                suggestions.push({
                    name: 'Salicylic Acid Cleanser',
                    category: 'cleanser',
                    reason: 'Unclogs pores and reduces acne'
                });
                suggestions.push({
                    name: 'Niacinamide Serum',
                    category: 'serum',
                    reason: 'Reduces inflammation and controls oil production'
                });
            }

            // Hydration
            if (goals.includes('hydration') || problems.includes('dryness')) {
                suggestions.push({
                    name: 'Hyaluronic Acid Serum',
                    category: 'serum',
                    reason: 'Deeply hydrates and plumps the skin'
                });
                suggestions.push({
                    name: 'Ceramide Moisturizer',
                    category: 'moisturizer',
                    reason: 'Restores and maintains skin barrier'
                });
            }

            // Brightening
            if (goals.includes('brightening') || problems.includes('dark-spots')) {
                suggestions.push({
                    name: 'Niacinamide Serum',
                    category: 'serum',
                    reason: 'Reduces dark spots and evens skin tone'
                });
                suggestions.push({
                    name: 'Vitamin C Serum',
                    category: 'serum',
                    reason: 'Brightens and fades hyperpigmentation'
                });
            }

            // Even skin tone
            if (goals.includes('even-tone')) {
                suggestions.push({
                    name: 'AHA/BHA Toner',
                    category: 'toner',
                    reason: 'Exfoliates and evens skin texture'
                });
            }

            // Reduce redness
            if (goals.includes('reduce-redness') || problems.includes('redness') || problems.includes('irritation')) {
                suggestions.push({
                    name: 'Centella Asiatica Serum',
                    category: 'serum',
                    reason: 'Calms inflammation and reduces redness'
                });
                suggestions.push({
                    name: 'Gentle Cleanser',
                    category: 'cleanser',
                    reason: 'Non-stripping formula for sensitive skin'
                });
            }

            // Sunscreen (always suggest for morning)
            if (currentRoutine === 'morning') {
                const hasSunscreen = routines.morning.sunscreen && routines.morning.sunscreen.length > 0;
                if (!hasSunscreen) {
                    suggestions.push({
                        name: 'SPF 30+ Sunscreen',
                        category: 'sunscreen',
                        reason: 'Essential for protecting skin from UV damage'
                    });
                }
            }

            return suggestions;
        }

        function checkProductExists(category, name) {
            const products = routines[currentRoutine][category] || [];
            return products.some(p => p.name.toLowerCase() === name.toLowerCase());
        }

        function addSuggestedProduct(category, name) {
            if (!routines[currentRoutine][category]) {
                routines[currentRoutine][category] = [];
            }

            routines[currentRoutine][category].push({
                name: name,
                category: category
            });

            localStorage.setItem('betterskin-routines', JSON.stringify(routines));
            loadRoutines();
        }

        // 7-Day Schedule Functions
        // Note: weekSchedule and scheduleStartDate are now managed by stateManager
        // The variables are initialized above and synced with stateManager

        function sanitizeId(str) {
            return str.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        async function generateSchedule() {
            if (!routines) {
                routines = { morning: {}, evening: {} };
            }
            
            // Check if user has products
            const hasMorningProducts = Object.keys(routines.morning || {}).some(key => 
                routines.morning[key] && routines.morning[key].length > 0
            );
            const hasEveningProducts = Object.keys(routines.evening || {}).some(key => 
                routines.evening[key] && routines.evening[key].length > 0
            );

            if (!hasMorningProducts && !hasEveningProducts) {
                alert('Please add products to your routines first!');
                return;
            }

            // Initialize or reset schedule - check Supabase first, then localStorage
            const scheduleData = await loadScheduleFromSupabase();
            
            if (scheduleData && scheduleData.schedule && scheduleData.startDate) {
                weekSchedule = scheduleData.schedule;
                scheduleStartDate = scheduleData.startDate;
                // Check if schedule is still valid (within 7 days)
                const daysSinceStart = Math.floor((new Date() - scheduleStartDate) / (1000 * 60 * 60 * 24));
                if (daysSinceStart >= 7) {
                    // Reset schedule if it's been more than 7 days
                    await createNewSchedule();
                } else {
                    // Update existing schedule to include all current products
                    await updateScheduleWithNewProducts();
                    loadSchedule();
                }
            } else {
                // Fallback to localStorage if Supabase has no data
            const savedSchedule = localStorage.getItem('betterskin-schedule');
            const savedStartDate = localStorage.getItem('betterskin-schedule-start');

            if (savedSchedule && savedStartDate) {
                weekSchedule = JSON.parse(savedSchedule);
                scheduleStartDate = new Date(savedStartDate);
                const daysSinceStart = Math.floor((new Date() - scheduleStartDate) / (1000 * 60 * 60 * 24));
                if (daysSinceStart >= 7) {
                        await createNewSchedule();
                } else {
                        // Update existing schedule to include all current products
                        await updateScheduleWithNewProducts();
                    loadSchedule();
                }
            } else {
                    await createNewSchedule();
                }
            }
        }

        async function createNewSchedule() {
            scheduleStartDate = new Date();
            scheduleStartDate.setHours(0, 0, 0, 0);
            weekSchedule = [];

            // Create 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date(scheduleStartDate);
                date.setDate(date.getDate() + i);

                const daySchedule = {
                    date: date.toISOString(),
                    morning: [],
                    evening: [],
                    completed: {
                        morning: [],
                        evening: []
                    }
                };

                // Add morning products
                Object.keys(routines.morning).forEach(category => {
                    if (routines.morning[category] && routines.morning[category].length > 0) {
                        routines.morning[category].forEach((product, pIndex) => {
                            daySchedule.morning.push({
                                id: `${i}-morning-${sanitizeId(category)}-${sanitizeId(product.name)}-${pIndex}`,
                                name: product.name,
                                category: category,
                                imageUrl: product.imageUrl || null,
                                completed: false
                            });
                        });
                    }
                });

                // Add evening products
                Object.keys(routines.evening).forEach(category => {
                    if (routines.evening[category] && routines.evening[category].length > 0) {
                        routines.evening[category].forEach((product, pIndex) => {
                            daySchedule.evening.push({
                                id: `${i}-evening-${sanitizeId(category)}-${sanitizeId(product.name)}-${pIndex}`,
                                name: product.name,
                                category: category,
                                imageUrl: product.imageUrl || null,
                                completed: false
                            });
                        });
                    }
                });

                weekSchedule.push(daySchedule);
            }


            await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
            await loadSchedule();
        }

        // Update schedule after product removal
        async function updateScheduleAfterProductRemoval(removedProduct, routineType) {
            if (!weekSchedule || weekSchedule.length === 0) {
                return;
            }

            let scheduleUpdated = false;

            weekSchedule.forEach(daySchedule => {
                const routineArray = routineType === 'morning' ? daySchedule.morning : daySchedule.evening;
                
                // Remove product from schedule if it matches
                const index = routineArray.findIndex(p => 
                    p.name === removedProduct.name && p.category === removedProduct.category
                );
                
                if (index > -1) {
                    routineArray.splice(index, 1);
                    scheduleUpdated = true;
                }
            });

            if (scheduleUpdated) {
                await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
            loadSchedule();
            }
        }

        // Update existing schedule with new products
        async function updateScheduleWithNewProducts() {
            // Try to load schedule if not already loaded
            if (!weekSchedule || weekSchedule.length === 0) {
                const scheduleData = await loadScheduleFromSupabase();
                if (scheduleData && scheduleData.schedule && scheduleData.schedule.length > 0) {
                    weekSchedule = scheduleData.schedule;
                    scheduleStartDate = scheduleData.startDate;
                } else {
                    // No schedule exists yet, nothing to update
                    return;
                }
            }

                if (!scheduleStartDate) {
                    return;
                }

            let scheduleUpdated = false;

            // Update each day in the schedule
            weekSchedule.forEach((daySchedule, dayIndex) => {
                // Update morning products - ensure ALL products from routines.morning are included
                Object.keys(routines.morning).forEach(category => {
                    if (routines.morning[category] && routines.morning[category].length > 0) {
                        routines.morning[category].forEach((product, pIndex) => {
                            // Check if product already exists in this day's morning routine
                            const exists = daySchedule.morning.some(p => 
                                p.name === product.name && p.category === category
                            );
                            
                            if (!exists) {
                                // Add new product
                                daySchedule.morning.push({
                                    id: `${dayIndex}-morning-${sanitizeId(category)}-${sanitizeId(product.name)}-${pIndex}`,
                                    name: product.name,
                                    category: category,
                                    imageUrl: product.imageUrl || null,
                                    completed: false
                                });
                                scheduleUpdated = true;
                            }
                        });
                    }
                });

                // Update evening products - ensure ALL products from routines.evening are included
                Object.keys(routines.evening).forEach(category => {
                    if (routines.evening[category] && routines.evening[category].length > 0) {
                        routines.evening[category].forEach((product, pIndex) => {
                            // Check if product already exists in this day's evening routine
                            const exists = daySchedule.evening.some(p => 
                                p.name === product.name && p.category === category
                            );
                            
                            if (!exists) {
                                // Add new product
                                daySchedule.evening.push({
                                    id: `${dayIndex}-evening-${sanitizeId(category)}-${sanitizeId(product.name)}-${pIndex}`,
                                    name: product.name,
                                    category: category,
                                    imageUrl: product.imageUrl || null,
                                    completed: false
                                });
                                scheduleUpdated = true;
                            }
                        });
                    }
                });
            });

            // Save updated schedule if changes were made
            if (scheduleUpdated) {
                await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
                loadSchedule();
            }
        }

        function generateRoutineTips() {
            const tipsContainer = document.getElementById('routine-tips-dashboard');
            if (!tipsContainer) return;

            tipsContainer.innerHTML = '';
            const tips = [];

            // Check for missed products that were reshuffled
            if (weekSchedule && weekSchedule.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Find today's schedule
                const todayScheduleForReshuffle = weekSchedule.find(day => {
                    const dayDate = new Date(day.date);
                    dayDate.setHours(0, 0, 0, 0);
                    return dayDate.getTime() === today.getTime();
                });

                if (todayScheduleForReshuffle) {
                    // Check for products in today that were originally scheduled for earlier days
                    let reshuffledProducts = [];
                    
                    todayScheduleForReshuffle.morning.forEach(product => {
                        const productId = product.id;
                        const dayIndex = parseInt(productId.split('-')[0]);
                        const todayIndex = weekSchedule.findIndex(d => {
                            const dDate = new Date(d.date);
                            dDate.setHours(0, 0, 0, 0);
                            return dDate.getTime() === today.getTime();
                        });
                        
                        if (dayIndex < todayIndex) {
                            // This product was originally scheduled for an earlier day
                            const originalDay = weekSchedule[dayIndex];
                            if (originalDay) {
                                const originalDate = new Date(originalDay.date);
                                originalDate.setHours(0, 0, 0, 0);
                                if (originalDate < today) {
                                    // Check if it was actually missed (not completed on original day)
                                    const wasMissed = !originalDay.completed.morning.includes(product.id);
                                    if (wasMissed) {
                                        reshuffledProducts.push({...product, routine: 'morning', originalDay: originalDate});
                                    }
                                }
                            }
                        }
                    });

                    todayScheduleForReshuffle.evening.forEach(product => {
                        const productId = product.id;
                        const dayIndex = parseInt(productId.split('-')[0]);
                        const todayIndex = weekSchedule.findIndex(d => {
                            const dDate = new Date(d.date);
                            dDate.setHours(0, 0, 0, 0);
                            return dDate.getTime() === today.getTime();
                        });
                        
                        if (dayIndex < todayIndex) {
                            const originalDay = weekSchedule[dayIndex];
                            if (originalDay) {
                                const originalDate = new Date(originalDay.date);
                                originalDate.setHours(0, 0, 0, 0);
                                if (originalDate < today) {
                                    const wasMissed = !originalDay.completed.evening.includes(product.id);
                                    if (wasMissed) {
                                        reshuffledProducts.push({...product, routine: 'evening', originalDay: originalDate});
                                    }
                                }
                            }
                        }
                    });

                    if (reshuffledProducts.length > 0) {
                        const uniqueProducts = [...new Map(reshuffledProducts.map(p => [p.name + p.routine, p])).values()];
                        if (uniqueProducts.length > 0) {
                            const productNames = uniqueProducts.slice(0, 2).map(p => p.name).join(', ');
                            const moreText = uniqueProducts.length > 2 ? ` and ${uniqueProducts.length - 2} more` : '';
                            tips.push({
                                type: 'info',
                                icon: '↻',
                                title: 'Reshuffled for You',
                                message: `You missed ${productNames}${moreText} earlier this week. We've automatically added them to today's routine to help you catch up.`
                            });
                        }
                    }
                }

                // Check for completion streaks
                let currentStreak = 0;
                for (let i = weekSchedule.length - 1; i >= 0; i--) {
                    const day = weekSchedule[i];
                    const dayDate = new Date(day.date);
                    dayDate.setHours(0, 0, 0, 0);
                    
                    if (dayDate > today) continue;
                    
                    const totalProducts = day.morning.length + day.evening.length;
                    const totalCompleted = (day.completed.morning.length + day.completed.evening.length);
                    
                    if (totalProducts > 0 && totalCompleted === totalProducts) {
                        currentStreak++;
                    } else if (dayDate < today) {
                        break;
                    }
                }

                if (currentStreak > 0) {
                    tips.push({
                        type: 'success',
                        icon: '',
                        title: 'Great Progress!',
                        message: `You've completed your routine ${currentStreak} day${currentStreak > 1 ? 's' : ''} in a row. Keep it up!`
                    });
                }

                // Check today's progress
                const todaySchedule = weekSchedule.find(day => {
                    const dayDate = new Date(day.date);
                    dayDate.setHours(0, 0, 0, 0);
                    return dayDate.getTime() === today.getTime();
                });

                if (todaySchedule) {
                    const totalToday = todaySchedule.morning.length + todaySchedule.evening.length;
                    const completedToday = todaySchedule.completed.morning.length + todaySchedule.completed.evening.length;
                    const pendingToday = totalToday - completedToday;

                    if (pendingToday > 0 && pendingToday <= 3) {
                        tips.push({
                            type: 'warning',
                            icon: '',
                            title: 'Almost There',
                            message: `You have ${pendingToday} step${pendingToday > 1 ? 's' : ''} left in today's routine. Finish strong!`
                        });
                    }
                }
            }

            // Check for products that might need attention
            if (userProfile.goals && userProfile.goals.length > 0) {
                const hasSunscreen = routines.morning && routines.morning.sunscreen && routines.morning.sunscreen.length > 0;
                if (!hasSunscreen && (userProfile.goals.includes('anti-aging') || userProfile.goals.includes('brightening'))) {
                    tips.push({
                        type: 'warning',
                        icon: '',
                        title: 'Sun Protection',
                        message: 'Consider adding sunscreen to your morning routine to protect your skin and support your goals.'
                    });
                }

                // Check for routine consistency
                if (weekSchedule && weekSchedule.length > 0) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const pastDays = weekSchedule.filter(day => {
                        const dayDate = new Date(day.date);
                        dayDate.setHours(0, 0, 0, 0);
                        return dayDate < today;
                    });

                    if (pastDays.length > 0) {
                        const completionRate = pastDays.reduce((acc, day) => {
                            const total = day.morning.length + day.evening.length;
                            const completed = day.completed.morning.length + day.completed.evening.length;
                            return acc + (total > 0 ? completed / total : 0);
                        }, 0) / pastDays.length;

                        if (completionRate < 0.5 && completionRate > 0) {
                            tips.push({
                                type: 'warning',
                                icon: '',
                                title: 'Routine Consistency',
                                message: `Your completion rate is ${Math.round(completionRate * 100)}%. Try to complete at least 80% of your routine for best results.`
                            });
                        } else if (completionRate >= 0.8) {
                            tips.push({
                                type: 'success',
                                icon: '',
                                title: 'Excellent Consistency',
                                message: `You're maintaining ${Math.round(completionRate * 100)}% completion rate. Your skin will thank you!`
                            });
                        }
                    }
                }

                // Check for missing key products based on goals
                if (userProfile.goals.includes('hydration') || userProfile.problems && userProfile.problems.includes('dryness')) {
                    const hasMoisturizer = (routines.morning && routines.morning.moisturizer && routines.morning.moisturizer.length > 0) ||
                                          (routines.evening && routines.evening.moisturizer && routines.evening.moisturizer.length > 0);
                    if (!hasMoisturizer) {
                        tips.push({
                            type: 'info',
                            icon: '',
                            title: 'Hydration Tip',
                            message: 'A good moisturizer can help with dryness. Consider adding one to your routine if you haven\'t already.'
                        });
                    }
                }

                if (userProfile.goals.includes('acne-treatment') || (userProfile.problems && userProfile.problems.includes('acne'))) {
                    const hasTreatment = (routines.evening && routines.evening.treatment && routines.evening.treatment.length > 0) ||
                                        (routines.evening && routines.evening.serum && routines.evening.serum.length > 0);
                    if (!hasTreatment) {
                        tips.push({
                            type: 'info',
                            icon: '',
                            title: 'Targeted Treatment',
                            message: 'Consider adding a treatment serum (like salicylic acid or niacinamide) to your evening routine for better acne management.'
                        });
                    }
                }
            }

            // If no tips, show a general message
            if (tips.length === 0) {
                tips.push({
                    type: 'success',
                    icon: '',
                    title: 'All Set',
                    message: 'Your routine is looking good! Check back tomorrow for personalized tips.'
                });
            }

            // Display tips
            tips.forEach(tip => {
                const tipDiv = document.createElement('div');
                tipDiv.className = `routine-tip-item ${tip.type}`;
                tipDiv.innerHTML = `
                    ${tip.icon ? `<div class="routine-tip-icon">${tip.icon}</div>` : ''}
                    <div class="routine-tip-content">
                        <div class="routine-tip-title">${tip.title}</div>
                        <div class="routine-tip-message">${tip.message}</div>
                    </div>
                `;
                tipsContainer.appendChild(tipDiv);
            });
        }

        async function loadSchedule() {
            // If schedule is not loaded, try to load it from Supabase or localStorage
            if (!weekSchedule || weekSchedule.length === 0) {
                const scheduleData = await loadScheduleFromSupabase();
                if (scheduleData && scheduleData.schedule && scheduleData.startDate) {
                    weekSchedule = scheduleData.schedule;
                    scheduleStartDate = scheduleData.startDate;
                } else {
                    // Fallback to localStorage
            const savedSchedule = localStorage.getItem('betterskin-schedule');
            const savedStartDate = localStorage.getItem('betterskin-schedule-start');
                    if (savedSchedule && savedStartDate) {
                        weekSchedule = JSON.parse(savedSchedule);
                        scheduleStartDate = new Date(savedStartDate);
                    }
                }
            }

            // If still no schedule, show message
            if (!weekSchedule || weekSchedule.length === 0) {
                const weekContainer = document.getElementById('week-schedule');
                if (weekContainer) {
                    weekContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <p style="font-size: 1.1rem; margin-bottom: 20px;">No schedule generated yet.</p>
                        <p>Add products to your routines and click "Generate 7-Day Schedule" to get started.</p>
                    </div>
                `;
                }
                return;
            }

            // Process any skipped items from previous days
            processSkippedItems();

            const weekContainer = document.getElementById('week-schedule');
            weekContainer.innerHTML = '';

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            weekSchedule.forEach((day, index) => {
                const date = new Date(day.date);
                const dayName = dayNames[date.getDay()];
                const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                const isToday = date.getTime() === today.getTime();
                const isPast = date.getTime() < today.getTime();

                // Calculate progress
                const morningCompleted = day.morning.filter(p => day.completed.morning.includes(p.id)).length;
                const eveningCompleted = day.evening.filter(p => day.completed.evening.includes(p.id)).length;
                const totalProducts = day.morning.length + day.evening.length;
                const totalCompleted = morningCompleted + eveningCompleted;
                const progress = totalProducts > 0 ? Math.round((totalCompleted / totalProducts) * 100) : 0;

                const dayCard = document.createElement('div');
                dayCard.className = `day-card ${isToday ? 'today' : ''} ${progress === 100 && !isPast ? 'complete' : ''}`;
                dayCard.innerHTML = `
                    <div class="day-header">
                        <div class="day-name">${dayName}, ${dateStr}</div>
                        <div class="day-progress-container">
                            <div class="day-progress-text">${progress}%</div>
                            <div class="day-progress-bar">
                                <div class="day-progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="day-routines-grid">
                        <div class="routine-column">
                            <div class="routine-time-label">Morning</div>
                            ${day.morning.length > 0 ? 
                                day.morning.map((product, pIdx) => {
                                    const safeId = sanitizeId(product.id);
                                    const categoryInitial = product.category ? product.category.charAt(0).toUpperCase() : '?';
                                    const imageHtml = product.imageUrl ? 
                                        `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" class="schedule-product-image" onerror="this.style.display='none'">` : 
                                        `<div class="schedule-product-image">${categoryInitial}</div>`;
                                    return `
                                    <div class="schedule-product-item ${day.completed.morning.includes(product.id) ? 'completed' : ''}">
                                        <input type="checkbox" 
                                               ${day.completed.morning.includes(product.id) ? 'checked' : ''} 
                                               ${isPast && !day.completed.morning.includes(product.id) ? 'disabled' : ''}
                                               onchange="toggleProductCompletionByIndex(${index}, 'morning', ${pIdx})"
                                               id="cb-${safeId}">
                                        <div class="schedule-product-info">
                                            <div class="schedule-product-name">${escapeHtml(product.name)}</div>
                                            <div class="schedule-product-category">${escapeHtml(product.category)}</div>
                                        </div>
                                        ${imageHtml}
                                    </div>
                                `;
                                }).join('') : 
                                '<div class="empty-day-message">No products</div>'
                            }
                        </div>

                        <div class="routine-column">
                            <div class="routine-time-label">Evening</div>
                            ${day.evening.length > 0 ? 
                                day.evening.map((product, pIdx) => {
                                    const safeId = sanitizeId(product.id);
                                    const categoryInitial = product.category ? product.category.charAt(0).toUpperCase() : '?';
                                    const imageHtml = product.imageUrl ? 
                                        `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" class="schedule-product-image" onerror="this.style.display='none'">` : 
                                        `<div class="schedule-product-image">${categoryInitial}</div>`;
                                    return `
                                    <div class="schedule-product-item ${day.completed.evening.includes(product.id) ? 'completed' : ''}">
                                        <input type="checkbox" 
                                               ${day.completed.evening.includes(product.id) ? 'checked' : ''} 
                                               ${isPast && !day.completed.evening.includes(product.id) ? 'disabled' : ''}
                                               onchange="toggleProductCompletionByIndex(${index}, 'evening', ${pIdx})"
                                               id="cb-${safeId}">
                                        <div class="schedule-product-info">
                                            <div class="schedule-product-name">${escapeHtml(product.name)}</div>
                                            <div class="schedule-product-category">${escapeHtml(product.category)}</div>
                                        </div>
                                        ${imageHtml}
                                    </div>
                                `;
                                }).join('') : 
                                '<div class="empty-day-message">No products</div>'
                            }
                        </div>
                    </div>
                `;

                weekContainer.appendChild(dayCard);
            });

            generateRoutineTips();
            renderSummary();
        }

        async function toggleProductCompletionByIndex(dayIndex, routineType, productIndex) {
            if (!weekSchedule || weekSchedule.length === 0) {
                return;
            }

            const day = weekSchedule[dayIndex];
            if (!day) {
                return;
            }

            const products = routineType === 'morning' ? day.morning : day.evening;
            const completedList = day.completed[routineType];
            
            if (productIndex >= products.length) {
                return;
            }
            
            const product = products[productIndex];
            if (!product) {
                return;
            }
            
            const productId = product.id;
            const checkboxId = `cb-${sanitizeId(productId)}`;
            const checkbox = document.getElementById(checkboxId);
            
            // Use checkbox state to determine action
            const isChecked = checkbox ? checkbox.checked : false;
            
            if (isChecked) {
                if (!completedList.includes(productId)) {
                    completedList.push(productId);
                }
            } else {
                const index = completedList.indexOf(productId);
                if (index > -1) {
                    completedList.splice(index, 1);
                }
            }

            // Save the updated schedule
            await saveScheduleToSupabase(weekSchedule, scheduleStartDate);

            // Reload to reflect changes
            await loadSchedule();
        }

        async function processSkippedItems() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let scheduleUpdated = false;

            // Track which products have been moved to avoid duplicates
            const movedProducts = new Set();

            // Check each day up to yesterday
            for (let i = 0; i < weekSchedule.length; i++) {
                const day = weekSchedule[i];
                const dayDate = new Date(day.date);
                dayDate.setHours(0, 0, 0, 0);

                // Only process past days (yesterday and earlier)
                if (dayDate >= today) {
                    continue;
                }

                // Find uncompleted morning products that haven't been moved yet
                const skippedMorning = day.morning.filter(product => 
                    !day.completed.morning.includes(product.id) && 
                    !movedProducts.has(`morning-${product.name}-${product.category}`)
                );

                // Find uncompleted evening products that haven't been moved yet
                const skippedEvening = day.evening.filter(product => 
                    !day.completed.evening.includes(product.id) && 
                    !movedProducts.has(`evening-${product.name}-${product.category}`)
                );

                // Move skipped items to next available day (today or future)
                if (skippedMorning.length > 0 || skippedEvening.length > 0) {
                    // Find next day (today or future, within the 7-day window)
                    for (let j = i + 1; j < weekSchedule.length; j++) {
                        const nextDay = weekSchedule[j];
                        const nextDayDate = new Date(nextDay.date);
                        nextDayDate.setHours(0, 0, 0, 0);
                        
                        // Only move to today or future days
                        if (nextDayDate < today) {
                            continue;
                        }
                        
                        // Add skipped morning products
                        skippedMorning.forEach(product => {
                            // Check if product already exists in next day
                            const exists = nextDay.morning.some(p => 
                                p.name === product.name && p.category === product.category
                            );
                            if (!exists) {
                                const pIndex = nextDay.morning.length;
                                nextDay.morning.push({
                                    id: `${j}-morning-${sanitizeId(product.category)}-${sanitizeId(product.name)}-${pIndex}`,
                                    name: product.name,
                                    category: product.category,
                                    imageUrl: product.imageUrl || null,
                                    completed: false
                                });
                                movedProducts.add(`morning-${product.name}-${product.category}`);
                                scheduleUpdated = true;
                            }
                        });

                        // Add skipped evening products
                        skippedEvening.forEach(product => {
                            // Check if product already exists in next day
                            const exists = nextDay.evening.some(p => 
                                p.name === product.name && p.category === product.category
                            );
                            if (!exists) {
                                const pIndex = nextDay.evening.length;
                                nextDay.evening.push({
                                    id: `${j}-evening-${sanitizeId(product.category)}-${sanitizeId(product.name)}-${pIndex}`,
                                    name: product.name,
                                    category: product.category,
                                    imageUrl: product.imageUrl || null,
                                    completed: false
                                });
                                movedProducts.add(`evening-${product.name}-${product.category}`);
                                scheduleUpdated = true;
                            }
                        });

                        // Only move to the first available day, then break
                        break;
                    }
                }
            }

            if (scheduleUpdated) {
                await saveScheduleToSupabase(weekSchedule, scheduleStartDate);
            }
        }

        // Blood Test Functions
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                analyzeBloodTest(file);
            }
        }

        // Drag and drop
        const uploadArea = document.getElementById('upload-area');
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                analyzeBloodTest(file);
            }
        });

        function analyzeBloodTest(file) {
            // Simulate analysis - In a real app, this would use ML/AI to parse the document
            const results = simulateBloodTestAnalysis();
            displayAnalysisResults(results);
        }

        function simulateBloodTestAnalysis() {
            // Simulated biomarker analysis
            const biomarkers = [
                {
                    name: 'Vitamin D',
                    value: '28 ng/mL',
                    status: 'low',
                    impact: 'Low vitamin D can affect skin barrier function and immune response.',
                    skincare: 'Add ceramide moisturizers and consider D3 supplementation after meals.'
                },
                {
                    name: 'Iron (Ferritin)',
                    value: '45 ng/mL',
                    status: 'normal',
                    impact: 'Iron levels are within normal range. This supports healthy skin cell turnover.',
                    skincare: 'Maintain current routine. Iron supports collagen production.'
                },
                {
                    name: 'Vitamin B12',
                    value: '350 pg/mL',
                    status: 'normal',
                    impact: 'Adequate B12 levels support healthy skin cell regeneration.',
                    skincare: 'No specific skincare changes needed based on B12 levels.'
                },
                {
                    name: 'Zinc',
                    value: '65 mcg/dL',
                    status: 'normal',
                    impact: 'Zinc levels are optimal. Zinc is important for wound healing and controlling inflammation.',
                    skincare: 'Continue using anti-inflammatory products if needed. Zinc supports acne treatment.'
                },
                {
                    name: 'Omega-3 Fatty Acids',
                    value: 'Below optimal',
                    status: 'low',
                    impact: 'Low omega-3 can contribute to dry skin and inflammation.',
                    skincare: 'Dial up hydrating products and discuss omega-3 supplements with your provider.'
                }
            ];

            return biomarkers;
        }

        function displayAnalysisResults(biomarkers, options = {}) {
            const resultsContainer = document.getElementById('analysis-results');
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '<div class="analysis-result"><h3 style="margin-bottom: 20px;">Detailed Biomarker Breakdown</h3>';

            biomarkers.forEach(biomarker => {
                const statusClass = biomarker.status === 'low' ? 'warning' : biomarker.status === 'high' ? 'warning' : 'good';
                const biomarkerDiv = document.createElement('div');
                biomarkerDiv.className = 'biomarker-item';
                biomarkerDiv.innerHTML = `
                    <div class="biomarker-name">${biomarker.name}</div>
                    <div class="biomarker-value">Value: ${biomarker.value} (${biomarker.status})</div>
                    <div class="biomarker-impact ${statusClass}">
                        <strong>Impact:</strong> ${biomarker.impact}
                    </div>
                    <div class="biomarker-impact" style="margin-top: 10px; background: #e8f4f8; color: #004085;">
                        <strong>Skincare Recommendation:</strong> ${biomarker.skincare}
                    </div>
                `;
                resultsContainer.querySelector('.analysis-result').appendChild(biomarkerDiv);
            });

            resultsContainer.innerHTML += '</div>';

            updateBloodInsightsUI(biomarkers);

            if (!options.preserveStorage) {
                localStorage.setItem('betterskin-biomarker-data', JSON.stringify(biomarkers));
            }
            localStorage.setItem('betterskin-insights', JSON.stringify(bloodInsights));
            renderSummary();
        }

        function updateBloodInsightsUI(biomarkers) {
            const wrapper = document.getElementById('blood-highlight-wrapper');
            const grid = document.getElementById('blood-highlights');
            const education = document.getElementById('education-tips');

            if (!wrapper || !grid || !education) {
                return;
            }

            grid.innerHTML = '';
            education.innerHTML = '';
            bloodInsights.highlights = [];
            bloodInsights.reminders = [];

            const priorityBiomarkers = biomarkers.filter(b => b.status !== 'normal');
            const cards = priorityBiomarkers.length > 0 ? priorityBiomarkers : biomarkers.slice(0, 3);

            cards.forEach(biomarker => {
                const card = document.createElement('div');
                card.className = `highlight-card ${biomarker.status !== 'normal' ? 'warning' : ''}`;
                const stateLabel = biomarker.status === 'low'
                    ? 'Needs support'
                    : biomarker.status === 'high'
                        ? 'Running high'
                        : 'Stable';
                card.innerHTML = `
                    <div class="card-label">${biomarker.name}</div>
                    <div class="step-name">${stateLabel}</div>
                    <p>${biomarker.impact}</p>
                    <p class="microcopy">Action: ${biomarker.skincare}</p>
                `;
                grid.appendChild(card);
                bloodInsights.highlights.push({
                    name: biomarker.name,
                    status: biomarker.status,
                    message: biomarker.impact
                });
            });

            biomarkers.forEach(biomarker => {
                const tip = document.createElement('div');
                tip.className = 'education-tip';
                tip.innerHTML = `
                    <strong>${biomarker.name}</strong>
                    <p>${buildEducationMessage(biomarker)}</p>
                `;
                education.appendChild(tip);
            });

            bloodInsights.reminders = priorityBiomarkers
                .filter(b => b.status === 'low')
                .map(b => getSupplementReminder(b.name));

            if (bloodInsights.reminders.length === 0) {
                bloodInsights.reminders.push('Stay consistent with balanced meals and your daily supplements.');
            }

            wrapper.style.display = 'block';
        }

        function buildEducationMessage(biomarker) {
            const library = {
                'Vitamin D': 'Vitamin D shortfalls often lead to dullness and compromised barrier recovery.',
                'Iron (Ferritin)': 'Ferritin supports oxygen delivery to skin, keeping tone vibrant and even.',
                'Vitamin B12': 'B12 stabilizes cell turnover, which keeps texture smooth.',
                'Zinc': 'Zinc keeps inflammation under control and supports blemish healing.',
                'Omega-3 Fatty Acids': 'Omega-3s calm reactivity and reinforce skin softness from the inside out.'
            };

            const base = library[biomarker.name] || biomarker.impact;
            return `${base} Recommended focus: ${biomarker.skincare}`;
        }

        function getSupplementReminder(name) {
            const guidance = {
                'Vitamin D': 'Vitamin D is trending low. Take your D3 with a fat-based meal and get brief morning sun.',
                'Iron (Ferritin)': 'Keep ferritin steady with iron-rich foods paired with vitamin C for absorption.',
                'Vitamin B12': 'Ensure B12 intake through fortified foods or your prescribed supplement.',
                'Zinc': 'Balance zinc with gentle, anti-inflammatory meals and continue topical calmers.',
                'Omega-3 Fatty Acids': 'Omega-3 levels are low. Add fatty fish or your omega supplement tonight.'
            };
            return guidance[name] || `Support ${name} levels with nutrition or supplements recommended by your provider.`;
        }

        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
        init();
        }
