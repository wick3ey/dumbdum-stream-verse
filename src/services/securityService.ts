
/**
 * Security Service for the streaming application
 * Provides utilities for authentication, authorization, and security checks
 */

import { toast } from "sonner";

/**
 * Verify if the current user should have creator access
 * @returns {boolean} True if the user is the creator of the stream
 */
export const verifyCreatorAccess = (userId: string | undefined): boolean => {
  if (!userId) return false;
  
  try {
    const creatorId = localStorage.getItem('creatorId');
    // Check if this user is the registered creator
    return creatorId === userId;
  } catch (error) {
    console.error("Error verifying creator access:", error);
    return false;
  }
};

/**
 * Records security violation attempts
 * @param {string} action The action being attempted
 * @param {string} userId The ID of the user attempting the action
 */
export const logSecurityViolation = (action: string, userId?: string): void => {
  const violation = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'unknown',
    userAgent: navigator.userAgent
  };
  
  console.error("Security violation detected:", violation);
  
  // In a real application, this would be sent to a server
  try {
    // Store locally for now
    const violations = JSON.parse(localStorage.getItem('security_violations') || '[]');
    violations.push(violation);
    localStorage.setItem('security_violations', JSON.stringify(violations));
  } catch (error) {
    console.error("Error logging security violation:", error);
  }
  
  // Notify user
  toast.error("Unauthorized action detected", {
    description: "This incident has been logged."
  });
};

/**
 * Enforce security check for creator actions
 * @param {string} userId The user ID attempting the action
 * @param {string} actionName Description of the action being attempted
 * @returns {boolean} True if the user is authorized to perform the action
 */
export const enforceCreatorSecurity = (userId: string | undefined, actionName: string): boolean => {
  const isAuthorized = verifyCreatorAccess(userId);
  
  if (!isAuthorized) {
    logSecurityViolation(actionName, userId);
    return false;
  }
  
  return true;
};

/**
 * Get the creator ID for the current stream
 * @returns {string|null} The creator ID or null if not set
 */
export const getStreamCreator = (): string | null => {
  return localStorage.getItem('creatorId');
};

/**
 * Set a new creator for the stream (only if no creator is currently set)
 * @param {string} userId The user ID to set as creator
 * @returns {boolean} True if successful, false if a creator is already set
 */
export const setStreamCreator = (userId: string): boolean => {
  const currentCreator = getStreamCreator();
  
  if (!currentCreator) {
    localStorage.setItem('creatorId', userId);
    return true;
  }
  
  return currentCreator === userId;
};
