/**
 * Elevia 3D Config Tool - Google Drive API Integration
 * 
 * Handles authentication and file operations with Google Drive
 */

// ============================================
// CONFIGURATION - Replace with your Client ID
// ============================================
const CLIENT_ID = '1078512393475-csigb03te2ov3uctbuv06jsj2hp4d3l1.apps.googleusercontent.com';
const API_KEY = ''; // Optional: for public data access
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Folder name in Google Drive
const DRIVE_FOLDER_NAME = '3D Tool';
const PARENT_FOLDER_NAME = 'Elevia';

// ============================================
// STATE
// ============================================
let tokenClient = null;
let gapiInited = false;
let gisInited = false;
let currentUser = null;
let driveFolderId = null;

// Callbacks for UI updates
let onAuthChangeCallback = null;
let onSyncStatusCallback = null;

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the Google Drive API client
 * @param {Function} onAuthChange - Callback when auth state changes
 * @param {Function} onSyncStatus - Callback for sync status updates
 */
async function initGoogleDrive(onAuthChange, onSyncStatus) {
    onAuthChangeCallback = onAuthChange;
    onSyncStatusCallback = onSyncStatus;
    
    // Load Google API scripts
    await loadGapiScript();
    await loadGisScript();
}

function loadGapiScript() {
    return new Promise((resolve, reject) => {
        if (window.gapi) {
            gapiLoaded().then(resolve);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => gapiLoaded().then(resolve);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function loadGisScript() {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts) {
            gisLoaded();
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            gisLoaded();
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function gapiLoaded() {
    await new Promise((resolve) => gapi.load('client', resolve));
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Will be set later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        // Check if user is already signed in (token in storage)
        const savedToken = localStorage.getItem('gapi_token');
        if (savedToken) {
            try {
                const token = JSON.parse(savedToken);
                gapi.client.setToken(token);
                handleAuthSuccess();
            } catch (e) {
                localStorage.removeItem('gapi_token');
            }
        }
        if (onAuthChangeCallback) {
            onAuthChangeCallback(isSignedIn(), currentUser);
        }
    }
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Check if user is signed in
 */
function isSignedIn() {
    return gapi.client.getToken() !== null;
}

/**
 * Get current user info
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Sign in with Google
 */
async function signIn() {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (response) => {
            if (response.error !== undefined) {
                reject(response);
                return;
            }
            // Save token
            localStorage.setItem('gapi_token', JSON.stringify(gapi.client.getToken()));
            await handleAuthSuccess();
            resolve(currentUser);
        };
        
        if (gapi.client.getToken() === null) {
            // Prompt user to select account
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            // Skip account selection
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
}

/**
 * Sign out
 */
function signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        localStorage.removeItem('gapi_token');
    }
    currentUser = null;
    driveFolderId = null;
    if (onAuthChangeCallback) {
        onAuthChangeCallback(false, null);
    }
}

async function handleAuthSuccess() {
    try {
        // Get user info
        const response = await gapi.client.drive.about.get({
            fields: 'user'
        });
        currentUser = response.result.user;
        
        // Find or create the config folder
        driveFolderId = await findOrCreateFolder();
        
        if (onAuthChangeCallback) {
            onAuthChangeCallback(true, currentUser);
        }
    } catch (e) {
        console.error('Error getting user info:', e);
    }
}

// ============================================
// FOLDER MANAGEMENT
// ============================================

/**
 * Find or create the 3D Tool folder in Google Drive
 */
async function findOrCreateFolder() {
    updateSyncStatus('syncing', 'Finding folder...');
    
    try {
        // First, find Elevia parent folder
        let parentId = 'root';
        const parentResponse = await gapi.client.drive.files.list({
            q: `name='${PARENT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });
        
        if (parentResponse.result.files && parentResponse.result.files.length > 0) {
            parentId = parentResponse.result.files[0].id;
        }
        
        // Find 3D Tool folder
        const query = parentId === 'root' 
            ? `name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
            : `name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`;
            
        const response = await gapi.client.drive.files.list({
            q: query,
            fields: 'files(id, name)',
            spaces: 'drive'
        });
        
        if (response.result.files && response.result.files.length > 0) {
            updateSyncStatus('synced', 'Connected');
            return response.result.files[0].id;
        }
        
        // Create folder if not exists
        const folderMetadata = {
            name: DRIVE_FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder',
            parents: parentId !== 'root' ? [parentId] : []
        };
        
        const createResponse = await gapi.client.drive.files.create({
            resource: folderMetadata,
            fields: 'id'
        });
        
        updateSyncStatus('synced', 'Folder created');
        return createResponse.result.id;
    } catch (e) {
        console.error('Error finding/creating folder:', e);
        updateSyncStatus('error', 'Folder error');
        return null;
    }
}

// ============================================
// FILE OPERATIONS
// ============================================

/**
 * List all config files in the 3D Tool folder
 * @returns {Array} List of config files with metadata
 */
async function listConfigs() {
    if (!driveFolderId) {
        console.error('No folder ID');
        return [];
    }
    
    updateSyncStatus('syncing', 'Loading configs...');
    
    try {
        const response = await gapi.client.drive.files.list({
            q: `'${driveFolderId}' in parents and mimeType='application/json' and trashed=false`,
            fields: 'files(id, name, modifiedTime, createdTime, size, thumbnailLink)',
            orderBy: 'modifiedTime desc',
            spaces: 'drive'
        });
        
        updateSyncStatus('synced', 'Loaded');
        return response.result.files || [];
    } catch (e) {
        console.error('Error listing configs:', e);
        updateSyncStatus('error', 'Load failed');
        return [];
    }
}

/**
 * Load a specific config file
 * @param {string} fileId - Google Drive file ID
 * @returns {Object} Config data
 */
async function loadConfig(fileId) {
    updateSyncStatus('syncing', 'Loading...');
    
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        
        updateSyncStatus('synced', 'Loaded');
        return response.result;
    } catch (e) {
        console.error('Error loading config:', e);
        updateSyncStatus('error', 'Load failed');
        return null;
    }
}

/**
 * Save a config to Google Drive
 * @param {Object} config - Config data to save
 * @param {string} existingFileId - Optional: existing file ID to update
 * @returns {Object} Saved file metadata
 */
async function saveConfig(config, existingFileId = null) {
    if (!driveFolderId) {
        console.error('No folder ID');
        return null;
    }
    
    updateSyncStatus('syncing', 'Saving...');
    
    // Ensure config has required fields
    const now = new Date().toISOString();
    if (!config.id) {
        config.id = 'config_' + Date.now();
    }
    if (!config.createdAt) {
        config.createdAt = now;
    }
    config.updatedAt = now;
    
    const fileName = `${config.name || 'Untitled'}.json`;
    const fileContent = JSON.stringify(config, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    
    try {
        let response;
        
        if (existingFileId) {
            // Update existing file
            response = await updateFile(existingFileId, blob, fileName);
        } else {
            // Create new file
            response = await createFile(blob, fileName);
        }
        
        updateSyncStatus('synced', 'Saved');
        return response;
    } catch (e) {
        console.error('Error saving config:', e);
        updateSyncStatus('error', 'Save failed');
        return null;
    }
}

async function createFile(blob, fileName) {
    const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [driveFolderId]
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.client.getToken().access_token }),
        body: form
    });
    
    return await response.json();
}

async function updateFile(fileId, blob, fileName) {
    // Update metadata
    await gapi.client.drive.files.update({
        fileId: fileId,
        resource: { name: fileName }
    });
    
    // Update content
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media&fields=id,name,modifiedTime`, {
        method: 'PATCH',
        headers: new Headers({ 
            'Authorization': 'Bearer ' + gapi.client.getToken().access_token,
            'Content-Type': 'application/json'
        }),
        body: blob
    });
    
    return await response.json();
}

/**
 * Delete a config file
 * @param {string} fileId - Google Drive file ID
 */
async function deleteConfig(fileId) {
    updateSyncStatus('syncing', 'Deleting...');
    
    try {
        await gapi.client.drive.files.delete({
            fileId: fileId
        });
        
        updateSyncStatus('synced', 'Deleted');
        return true;
    } catch (e) {
        console.error('Error deleting config:', e);
        updateSyncStatus('error', 'Delete failed');
        return false;
    }
}

/**
 * Duplicate a config file
 * @param {string} fileId - Google Drive file ID
 * @param {string} newName - Name for the copy
 */
async function duplicateConfig(fileId, newName) {
    updateSyncStatus('syncing', 'Duplicating...');
    
    try {
        const response = await gapi.client.drive.files.copy({
            fileId: fileId,
            resource: {
                name: `${newName}.json`,
                parents: [driveFolderId]
            }
        });
        
        updateSyncStatus('synced', 'Duplicated');
        return response.result;
    } catch (e) {
        console.error('Error duplicating config:', e);
        updateSyncStatus('error', 'Duplicate failed');
        return null;
    }
}

// ============================================
// THUMBNAIL SUPPORT
// ============================================

/**
 * Upload a thumbnail for a config
 * @param {string} fileId - Config file ID
 * @param {string} thumbnailDataUrl - Base64 data URL of thumbnail
 */
async function uploadThumbnail(fileId, thumbnailDataUrl) {
    // Google Drive doesn't support custom thumbnails for JSON files
    // Instead, we'll store the thumbnail in the config itself
    // or as a separate image file
    
    const config = await loadConfig(fileId);
    if (config) {
        config.thumbnail = thumbnailDataUrl;
        await saveConfig(config, fileId);
    }
}

/**
 * Create a thumbnail from canvas
 * @param {HTMLCanvasElement} canvas - The Spline canvas
 * @returns {string} Base64 data URL
 */
function createThumbnailFromCanvas(canvas) {
    // Create a smaller canvas for thumbnail
    const thumbCanvas = document.createElement('canvas');
    const thumbSize = 200;
    thumbCanvas.width = thumbSize;
    thumbCanvas.height = thumbSize;
    
    const ctx = thumbCanvas.getContext('2d');
    
    // Calculate aspect ratio crop
    const srcAspect = canvas.width / canvas.height;
    let srcX = 0, srcY = 0, srcW = canvas.width, srcH = canvas.height;
    
    if (srcAspect > 1) {
        srcW = canvas.height;
        srcX = (canvas.width - srcW) / 2;
    } else {
        srcH = canvas.width;
        srcY = (canvas.height - srcH) / 2;
    }
    
    ctx.drawImage(canvas, srcX, srcY, srcW, srcH, 0, 0, thumbSize, thumbSize);
    
    return thumbCanvas.toDataURL('image/jpeg', 0.7);
}

// ============================================
// SYNC STATUS
// ============================================

function updateSyncStatus(status, message) {
    if (onSyncStatusCallback) {
        onSyncStatusCallback(status, message);
    }
}

// ============================================
// LOCAL STORAGE CACHE
// ============================================

const CACHE_KEY = 'elevia_3d_configs_cache';

/**
 * Cache configs locally for offline access
 * @param {Array} configs - Configs to cache
 */
function cacheConfigs(configs) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            configs: configs
        }));
    } catch (e) {
        console.warn('Failed to cache configs:', e);
    }
}

/**
 * Get cached configs
 * @returns {Object} Cached data with timestamp
 */
function getCachedConfigs() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
}

// ============================================
// EXPORT
// ============================================

// Make functions available globally
window.GoogleDriveAPI = {
    // Init
    init: initGoogleDrive,
    
    // Auth
    isSignedIn,
    getCurrentUser,
    signIn,
    signOut,
    
    // File operations
    listConfigs,
    loadConfig,
    saveConfig,
    deleteConfig,
    duplicateConfig,
    
    // Thumbnails
    uploadThumbnail,
    createThumbnailFromCanvas,
    
    // Cache
    cacheConfigs,
    getCachedConfigs,
    
    // Folder
    getFolderId: () => driveFolderId
};



