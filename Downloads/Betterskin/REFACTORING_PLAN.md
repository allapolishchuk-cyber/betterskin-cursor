# Refactoring Plan

## Completed
- ✅ Extracted CSS to `src/css/styles.css`
- ✅ Created `src/js/config.js` - Supabase configuration
- ✅ Created `src/utils/errorHandler.js` - Error handling utilities
- ✅ Created `src/js/utils.js` - Utility functions
- ✅ Created `src/js/storage.js` - Storage operations (Supabase/localStorage)

## Remaining Tasks

### 1. Create State Management Module (`src/js/state.js`)
- Manage global state (routines, userProfile, weekSchedule, etc.)
- Provide getters/setters
- Ensure state consistency

### 2. Create Product Management Module (`src/js/products.js`)
- Product CRUD operations
- Product conflict detection
- Product validation
- Remove all console.log statements

### 3. Create Routine Management Module (`src/js/routines.js`)
- Routine building logic
- Product placement rules
- Layering rules for serums
- Mandatory product suggestions

### 4. Create Schedule Management Module (`src/js/schedule.js`)
- Schedule generation
- Schedule updates
- Product completion tracking

### 5. Create UI Rendering Module (`src/js/ui.js`)
- All DOM manipulation
- Safe HTML rendering (prevent XSS)
- Modal management
- Form handling

### 6. Create Main App Module (`src/js/app.js`)
- Application initialization
- Event handlers
- Navigation
- Coordinate all modules

### 7. Update `index.html`
- Remove inline styles (link to CSS file)
- Remove inline scripts (use module imports)
- Use ES6 modules with type="module"

### 8. Create Unit Tests (`tests/`)
- Test storage operations
- Test utility functions
- Test error handling
- Test product validation

## Bug Fixes Applied
- ✅ Added proper error handling with user-friendly messages
- ✅ Removed console.log statements from storage module
- ✅ Added safe JSON parsing
- ✅ Added XSS protection with escapeHtml
- ✅ Added null checks for DOM elements

## Remaining Bug Fixes
- Fix all JSON.parse calls to use safeJsonParse
- Fix all innerHTML assignments to use safe methods
- Add null checks throughout
- Fix race conditions in async operations
- Add loading states for async operations

