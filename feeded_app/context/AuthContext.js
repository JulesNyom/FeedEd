"use client"
import { auth, db } from '@/firebase'
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState(null)
    const [loading, setLoading] = useState(true)

    // AUTH HANDLERS
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }
    async function handleUser(user) {
        if (user) {
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                setUserDataObj(docSnap.data())
            } else {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }
                await setDoc(docRef, userData)
                setUserDataObj(userData)
            }
        } else {
            setUserDataObj(null)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                setLoading(true)
                setCurrentUser(user)
                await handleUser(user)
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loginWithGoogle,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}