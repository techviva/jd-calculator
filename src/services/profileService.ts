import { db } from '../lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import type { UserProfile } from '../contexts/AuthContext'

// Get user profile by ID
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting profile:', error)
    return null
  }
}

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('username', '==', username))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('Error getting profile by username:', error)
    return null
  }
}

// Create new profile
export const createProfile = async (
  userId: string,
  username: string,
  email: string
): Promise<UserProfile> => {
  const timestamp = Date.now()

  const profileData: UserProfile = {
    username,
    email,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, profileData)
    return profileData
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

// Update profile
export const updateProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}
