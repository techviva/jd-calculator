/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Parse Firebase and other common errors into human-readable messages
 */
export function parseError(error: unknown): string {
  // Handle Firebase Auth errors
  if (typeof error === 'object' && error !== null) {
    // Extract error code from Firebase error
    const errorCode = (error as any).code

    if (errorCode) {
      // Firebase Authentication errors
      switch (errorCode) {
        // Auth email/password errors
        case 'auth/invalid-email':
          return 'The email address is not valid.'
        case 'auth/user-disabled':
          return 'This account has been disabled.'
        case 'auth/user-not-found':
          return 'No account found with this email.'
        case 'auth/wrong-password':
          return 'The password is incorrect.'
        case 'auth/email-already-in-use':
          return 'This email address is already in use.'
        case 'auth/weak-password':
          return 'The password is too weak. Please use a stronger password.'
        case 'auth/invalid-credential':
          return 'Invalid login credentials.'
        case 'auth/operation-not-allowed':
          return 'This operation is not allowed.'
        case 'auth/account-exists-with-different-credential':
          return 'An account already exists with the same email but different sign-in credentials.'
        case 'auth/requires-recent-login':
          return 'This operation requires a more recent login. Please sign in again.'
        case 'auth/too-many-requests':
          return 'Too many unsuccessful login attempts. Please try again later.'

        // Network errors
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection and try again.'

        // Default case for other Firebase errors
        default:
          return `Authentication error: ${errorCode.replace('auth/', '')}`
      }
    }

    // Try to get the error message
    const errorMessage = (error as Error)?.message || (error as any)?.message
    if (errorMessage) {
      return errorMessage
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Fallback for unknown error types
  return 'An unknown error occurred. Please try again.'
}

/**
 * Parse error for a specific field context (e.g., username, password)
 */
export function parseFieldError(error: unknown, field: string): string {
  const message = parseError(error)

  // Return specific field-related errors
  if (field === 'email' && message.toLowerCase().includes('email')) {
    return message
  }

  if (field === 'password' && message.toLowerCase().includes('password')) {
    return message
  }

  if (field === 'username' && message.toLowerCase().includes('user')) {
    return message
  }

  // Default response for field-specific errors
  return message
}

/**
 * Determine if an error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const errorCode = (error as any).code
    if (errorCode === 'auth/network-request-failed') {
      return true
    }

    const errorMessage = (error as Error)?.message || (error as any)?.message
    if (
      errorMessage &&
      (errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('offline'))
    ) {
      return true
    }
  }

  return false
}
