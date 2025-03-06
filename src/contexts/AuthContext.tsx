'use client'

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export type UserProfile = {
  username: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: number
  updatedAt: number
  // Add any other profile fields you need
}

export type User = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  profile?: UserProfile
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (email: string, password: string, username: string) => Promise<User | null>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const LOCAL_STORAGE_KEY = 'vivaJobCalculator_auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to get user profile from Firestore
async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const profileRef = doc(db, 'users', uid)
    const profileSnap = await getDoc(profileRef)

    if (profileSnap.exists()) {
      return profileSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Helper function to create user profile in Firestore
async function createUserProfile(
  uid: string,
  username: string,
  email: string
): Promise<UserProfile> {
  const timestamp = Date.now()
  const userProfile: UserProfile = {
    username,
    email,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, userProfile)

  return userProfile
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial user state from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY)
      console.log('🚀 ~ AuthContext.tsx:91 ~ savedUser:', savedUser)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Error loading auth from localStorage:', error)
    }
  }, [])

  // Update user in state and localStorage
  const updateUserState = (newUser: User | null) => {
    setUser(newUser)

    try {
      if (newUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser))
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error saving auth to localStorage:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          let profile = await getUserProfile(firebaseUser.uid)

          // Create profile if it doesn't exist
          if (!profile && firebaseUser.email) {
            const username = firebaseUser.email.split('@')[0]
            profile = await createUserProfile(firebaseUser.uid, username, firebaseUser.email)
          }

          const updatedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            profile: profile ?? undefined,
          }

          updateUserState(updatedUser)
        } catch (error) {
          console.error('Error in auth state change:', error)
        }
      } else {
        // Only clear user if we're sure they're logged out
        // This prevents flickering on page reload
        updateUserState(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = credential.user

      let profile = await getUserProfile(firebaseUser.uid)

      // Create profile if it doesn't exist
      if (!profile) {
        const username = email.split('@')[0]
        profile = await createUserProfile(firebaseUser.uid, username, email)
      }

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        profile,
      }

      updateUserState(user)
      return user
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<User | null> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = credential.user

      // Update display name
      await updateProfile(firebaseUser, { displayName: username })

      // Create profile
      const profile = await createUserProfile(firebaseUser.uid, username, email)

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: username,
        photoURL: firebaseUser.photoURL,
        profile,
      }

      updateUserState(user)
      return user
    } catch (error) {
      console.error('Registration error:', error)
      return null
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      updateUserState(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user?.uid) return

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: Date.now(),
      })

      // Update local state
      if (user.profile) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...data,
            updatedAt: Date.now(),
          },
        }
        updateUserState(updatedUser)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!(localStorage.getItem(LOCAL_STORAGE_KEY) || user),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
