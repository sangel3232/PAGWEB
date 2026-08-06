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
  timestamp: Timestamp | Date
}

/** Upload a file to Firebase Storage and return its download URL */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/** Save a new submission to Firestore */
export async function saveSubmission(
  data: Omit<Submission, 'id' | 'createdAt'>
): Promise<string> {

  // Convertir Date a Timestamp (Firestore acepta Date pero viaja mejor como Timestamp)
  const raw = {
    ...data,
    conversation: data.conversation.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date
        ? Timestamp.fromDate(msg.timestamp)
        : msg.timestamp,
    })),
    createdAt: Timestamp.now(),
  }

  // Eliminar cualquier campo undefined antes de guardar
  const cleanData = Object.fromEntries(
    Object.entries(raw).filter(([, value]) => value !== undefined)
  )

  const docRef = await addDoc(
    collection(db, 'submissions'),
    cleanData
  )

  return docRef.id
}

/** Get all submissions, optionally filtered by department */
export async function getSubmissions(departmentSlug?: string): Promise<Submission[]> {
  try {
    let q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))

    if (departmentSlug) {
      q = query(
        collection(db, 'submissions'),
        where('departmentSlug', '==', departmentSlug),
        orderBy('createdAt', 'desc')
      )
    }

    const snapshot = await getDocs(q)

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    } as Submission))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if ((msg.includes('index') || msg.includes('requires')) && departmentSlug) {
      console.warn('Índice compuesto faltante. Usando filtro manual.', e)
      const snapshot = await getDocs(
        query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))
      )
      const all = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      } as Submission))
      return all.filter(s => s.departmentSlug === departmentSlug)
    }
    throw e
  }
}

/** Update submission status */
export async function updateStatus(
  id: string,
  status: SubmissionStatus
): Promise<void> {
  await updateDoc(doc(db, 'submissions', id), { status })
}

/** Add admin reply to a submission */
export async function addAdminReply(
  id: string,
  reply: string
): Promise<void> {
  await updateDoc(doc(db, 'submissions', id), {
    adminReply: reply,
    repliedAt: Timestamp.now(),
  })
}