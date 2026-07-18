// Submission service — saves client requests to Firestore + Storage
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'

export type SubmissionStatus = 'Pendiente' | 'En revisión' | 'Aprobado' | 'Finalizado'

export interface Submission {
  id?: string
  department: string
  departmentSlug: string
  clientName: string
  clientPhone: string
  clientEmail: string
  message: string
  workTitle?: string
  lyrics?: string
  audioUrl?: string
  fileUrls?: string[]
  observations?: string
  status: SubmissionStatus
  createdAt: Timestamp | Date
  conversation: ConversationMessage[]
}

export interface ConversationMessage {
  role: 'assistant' | 'user'
  text: string
  timestamp: Date
}

/** Upload a file to Firebase Storage and return its download URL */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/** Save a new submission to Firestore */
export async function saveSubmission(data: Omit<Submission, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'submissions'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

/** Get all submissions, optionally filtered by department */
export async function getSubmissions(departmentSlug?: string): Promise<Submission[]> {
  let q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))
  if (departmentSlug) {
    q = query(
      collection(db, 'submissions'),
      where('departmentSlug', '==', departmentSlug),
      orderBy('createdAt', 'desc')
    )
  }
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Submission))
}

/** Update submission status */
export async function updateStatus(id: string, status: SubmissionStatus): Promise<void> {
  await updateDoc(doc(db, 'submissions', id), { status })
}

/** Add admin reply to a submission */
export async function addAdminReply(id: string, reply: string): Promise<void> {
  await updateDoc(doc(db, 'submissions', id), {
    adminReply: reply,
    repliedAt: Timestamp.now(),
  })
}

/** Mock save (used when Firebase is not configured) */
export function saveSubmissionLocal(data: DocumentData): void {
  const existing = JSON.parse(localStorage.getItem('zc_submissions') || '[]')
  existing.push({ ...data, id: Date.now().toString(), createdAt: new Date().toISOString() })
  localStorage.setItem('zc_submissions', JSON.stringify(existing))
}

export function getSubmissionsLocal(): DocumentData[] {
  return JSON.parse(localStorage.getItem('zc_submissions') || '[]')
}
