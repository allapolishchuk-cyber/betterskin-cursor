/**
 * Storage Module
 * Handles all data persistence (Supabase and localStorage)
 */

import { USE_SUPABASE, supabase } from './config.js';
import { getUserId } from './utils.js';
import { handleError, safeJsonParse, showError } from '../utils/errorHandler.js';

/**
 * Save routines to storage
 * @param {Object} routines - Routines object to save
 */
export async function saveRoutines(routines) {
    if (!USE_SUPABASE) {
        try {
            localStorage.setItem('betterskin-routines', JSON.stringify(routines));
        } catch (error) {
            handleError(error, 'Failed to save routines');
        }
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
        handleError(error, 'Failed to save routines');
        // Fallback to localStorage
        try {
            localStorage.setItem('betterskin-routines', JSON.stringify(routines));
        } catch (localError) {
            handleError(localError, 'Failed to save routines to local storage');
        }
    }
}

/**
 * Load routines from storage
 * @returns {Object|null} Routines object or null
 */
export async function loadRoutines() {
    if (!USE_SUPABASE) {
        const saved = localStorage.getItem('betterskin-routines');
        return safeJsonParse(saved, null);
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
        return safeJsonParse(saved, null);
    } catch (error) {
        handleError(error, 'Failed to load routines');
        // Fallback to localStorage
        const saved = localStorage.getItem('betterskin-routines');
        return safeJsonParse(saved, null);
    }
}

/**
 * Save profile to storage
 * @param {Object} profile - Profile object to save
 */
export async function saveProfile(profile) {
    if (!USE_SUPABASE) {
        try {
            localStorage.setItem('betterskin-profile', JSON.stringify(profile));
        } catch (error) {
            handleError(error, 'Failed to save profile');
        }
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
        handleError(error, 'Failed to save profile');
        // Fallback to localStorage
        try {
            localStorage.setItem('betterskin-profile', JSON.stringify(profile));
        } catch (localError) {
            handleError(localError, 'Failed to save profile to local storage');
        }
    }
}

/**
 * Load profile from storage
 * @returns {Object|null} Profile object or null
 */
export async function loadProfile() {
    if (!USE_SUPABASE) {
        const saved = localStorage.getItem('betterskin-profile');
        return safeJsonParse(saved, null);
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
        return safeJsonParse(saved, null);
    } catch (error) {
        handleError(error, 'Failed to load profile');
        const saved = localStorage.getItem('betterskin-profile');
        return safeJsonParse(saved, null);
    }
}

/**
 * Save schedule to storage
 * @param {Array} schedule - Schedule array to save
 * @param {Date} startDate - Schedule start date
 */
export async function saveSchedule(schedule, startDate) {
    if (!USE_SUPABASE) {
        try {
            localStorage.setItem('betterskin-schedule', JSON.stringify(schedule));
            localStorage.setItem('betterskin-schedule-start', startDate.toISOString());
        } catch (error) {
            handleError(error, 'Failed to save schedule');
        }
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
        handleError(error, 'Failed to save schedule');
        // Fallback to localStorage
        try {
            localStorage.setItem('betterskin-schedule', JSON.stringify(schedule));
            localStorage.setItem('betterskin-schedule-start', startDate.toISOString());
        } catch (localError) {
            handleError(localError, 'Failed to save schedule to local storage');
        }
    }
}

/**
 * Load schedule from storage
 * @returns {Object|null} Object with schedule and startDate, or null
 */
export async function loadSchedule() {
    if (!USE_SUPABASE) {
        const savedSchedule = localStorage.getItem('betterskin-schedule');
        const savedStartDate = localStorage.getItem('betterskin-schedule-start');
        if (savedSchedule && savedStartDate) {
            try {
                return {
                    schedule: safeJsonParse(savedSchedule, []),
                    startDate: new Date(savedStartDate)
                };
            } catch (error) {
                handleError(error, 'Failed to parse schedule');
                return null;
            }
        }
        return null;
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
            return {
                schedule: safeJsonParse(savedSchedule, []),
                startDate: new Date(savedStartDate)
            };
        }
        return null;
    } catch (error) {
        handleError(error, 'Failed to load schedule');
        const savedSchedule = localStorage.getItem('betterskin-schedule');
        const savedStartDate = localStorage.getItem('betterskin-schedule-start');
        if (savedSchedule && savedStartDate) {
            return {
                schedule: safeJsonParse(savedSchedule, []),
                startDate: new Date(savedStartDate)
            };
        }
        return null;
    }
}

