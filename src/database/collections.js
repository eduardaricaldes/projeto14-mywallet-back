import db from './db.js'

export const userCollection = db.collection("users")
export const walletCollection = db.collection("wallet")
export const sessionsCollection = db.collection("sessions")