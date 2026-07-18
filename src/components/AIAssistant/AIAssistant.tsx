import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { DepartmentFlow, FlowData, ConversationStep } from '../../lib/conversationFlows'
import type { ConversationMessage } from '../../lib/submissions'
import { saveSubmissionLocal } from '../../lib/submissions'
import styles from './AIAssistant.module.css'

interface AIAssistantProps {
  flow: DepartmentFlow
  onClose: () => void
  onComplete?: (data: FlowData, conversation: ConversationMessage[]) => void
}

type Phase = 'greeting' | 'collecting' | 'done'

function interpolate(template: string, data: Partial<FlowData>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = (data as Record<string, unknown>)[key]
    return typeof value === 'string' ? value : ''
  })
}

export function AIAssistant({ flow, onClose, onComplete }: AIAssistantProps) {
  const [phase, setPhase] = useState<Phase>('greeting')
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [data, setData] = useState<FlowData>({})
  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    { role: 'assistant', text: flow.greeting, timestamp: new Date() },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  // Voice input — using any to avoid TypeScript SpeechRecognition ambient type issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const currentStep: ConversationStep | undefined = flow.steps[currentStepIdx]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation, isTyping])

  // Focus input when step changes
  useEffect(() => {
    if (phase === 'collecting') {
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [currentStepIdx, phase])

  const addAssistantMessage = useCallback((text: string) => {
    return new Promise<void>(resolve => {
      setIsTyping(true)
      const delay = Math.min(800 + text.length * 8, 2000)
      setTimeout(() => {
        setIsTyping(false)
        setConversation(prev => [
          ...prev,
          { role: 'assistant', text, timestamp: new Date() },
        ])
        resolve()
      }, delay)
    })
  }, [])

  const handleStart = useCallback(async () => {
    setPhase('collecting')
    await addAssistantMessage(flow.steps[0].assistantMessage)
  }, [addAssistantMessage, flow.steps])

  const handleSubmitStep = useCallback(async () => {
    if (!currentStep) return
    const value = currentStep.fieldType === 'file' || currentStep.fieldType === 'audio'
      ? selectedFile
      : inputValue.trim()

    if (currentStep.required && !value) {
      setError('Este campo es obligatorio.')
      return
    }

    setError(null)

    // Save to data
    const newData: FlowData = {
      ...data,
      [currentStep.dataKey]: value ?? undefined,
    }
    setData(newData)

    // Add user message
    const userText = selectedFile ? `📎 ${selectedFile.name}` : inputValue
    setConversation(prev => [
      ...prev,
      { role: 'user', text: userText, timestamp: new Date() },
    ])
    setInputValue('')
    setSelectedFile(null)

    const nextIdx = currentStepIdx + 1

    if (nextIdx >= flow.steps.length) {
      // Done
      setPhase('done')
      await addAssistantMessage(flow.farewell)

      // Save locally (Firebase save would go here with real config)
      saveSubmissionLocal({
        department: flow.name,
        departmentSlug: flow.slug,
        ...newData,
        conversation,
        status: 'Pendiente',
      })

      onComplete?.(newData, conversation)
    } else {
      setCurrentStepIdx(nextIdx)
      const nextMsg = interpolate(flow.steps[nextIdx].assistantMessage, newData)
      await addAssistantMessage(nextMsg)
    }
  }, [
    currentStep, currentStepIdx, data, flow, inputValue,
    selectedFile, conversation, addAssistantMessage, onComplete,
  ])

  // Voice input
  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Tu navegador no soporta reconocimiento de voz.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRec) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRec() as any
    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInputValue(prev => prev + transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isListening])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && currentStep?.fieldType !== 'textarea') {
      e.preventDefault()
      handleSubmitStep()
    }
  }

  const renderInput = () => {
    if (!currentStep || phase !== 'collecting') return null

    if (currentStep.fieldType === 'select') {
      return (
        <div className={styles.optionsGrid}>
          {currentStep.options?.map(opt => (
            <button
              key={opt}
              className={`${styles.optionBtn} ${inputValue === opt ? styles.optionBtnSelected : ''}`}
              onClick={() => setInputValue(opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      )
    }

    if (currentStep.fieldType === 'file' || currentStep.fieldType === 'audio') {
      return (
        <div className={styles.fileUpload}>
          <label className={styles.fileLabel}>
            <input
              type="file"
              accept={currentStep.accepts}
              className={styles.fileInput}
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <span className={styles.fileBtnText}>
              {selectedFile ? `✓ ${selectedFile.name}` : '📎 Seleccionar archivo'}
            </span>
          </label>
        </div>
      )
    }

    if (currentStep.fieldType === 'textarea') {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          className={styles.textarea}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={currentStep.placeholder}
          rows={4}
          onKeyDown={handleKeyDown}
          aria-label={currentStep.fieldLabel}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        className={styles.input}
        type={currentStep.fieldType}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder={currentStep.placeholder}
        onKeyDown={handleKeyDown}
        aria-label={currentStep.fieldLabel}
        autoComplete="off"
      />
    )
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.panel}
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        role="dialog"
        aria-label={`Asistente de ${flow.name}`}
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.assistantAvatar} aria-hidden="true">
              <span>ZC</span>
              <span className={styles.onlineDot} />
            </div>
            <div className={styles.headerInfo}>
              <p className={styles.assistantName}>Asistente Virtual</p>
              <p className={styles.departmentName}>{flow.name}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar asistente" type="button">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {phase === 'collecting' && (
          <div className={styles.progressBar} role="progressbar"
            aria-valuenow={currentStepIdx} aria-valuemax={flow.steps.length}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStepIdx) / flow.steps.length) * 100}%` }}
            />
          </div>
        )}

        {/* Messages */}
        <div className={styles.messages} role="log" aria-live="polite">
          {conversation.map((msg, i) => (
            <motion.div
              key={i}
              className={`${styles.bubble} ${msg.role === 'assistant' ? styles.bubbleAssistant : styles.bubbleUser}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className={`${styles.bubble} ${styles.bubbleAssistant} ${styles.typingBubble}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {!isTyping && (
          <div className={styles.inputArea}>
            {phase === 'greeting' && (
              <button className={styles.startBtn} onClick={handleStart} type="button">
                Comenzar →
              </button>
            )}

            {phase === 'collecting' && (
              <>
                {error && (
                  <p className={styles.errorMsg} role="alert">{error}</p>
                )}
                <div className={styles.inputRow}>
                  <div className={styles.inputWrapper}>
                    {renderInput()}
                  </div>
                  <div className={styles.inputActions}>
                    {/* Voice button (only for text/textarea) */}
                    {(currentStep?.fieldType === 'text' ||
                      currentStep?.fieldType === 'textarea' ||
                      currentStep?.fieldType === 'email' ||
                      currentStep?.fieldType === 'tel') && (
                      <button
                        className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ''}`}
                        onClick={toggleVoice}
                        type="button"
                        aria-label={isListening ? 'Detener grabación' : 'Hablar'}
                        title={isListening ? 'Detener' : 'Hablar con el micrófono'}
                      >
                        🎙️
                      </button>
                    )}
                    {/* Skip optional */}
                    {currentStep && !currentStep.required && (
                      <button
                        className={styles.skipBtn}
                        onClick={() => {
                          setInputValue('')
                          setSelectedFile(null)
                          handleSubmitStep()
                        }}
                        type="button"
                        aria-label="Omitir este campo"
                      >
                        Omitir
                      </button>
                    )}
                    <button
                      className={styles.sendBtn}
                      onClick={handleSubmitStep}
                      type="button"
                      aria-label="Enviar respuesta"
                      disabled={
                        currentStep?.required &&
                        !inputValue.trim() &&
                        !selectedFile
                      }
                    >
                      →
                    </button>
                  </div>
                </div>
                {currentStep && (
                  <p className={styles.fieldHint}>
                    {currentStep.fieldLabel}
                    {currentStep.required && <span className={styles.required}> *</span>}
                  </p>
                )}
              </>
            )}

            {phase === 'done' && (
              <div className={styles.doneActions}>
                <button className={styles.doneBtn} onClick={onClose} type="button">
                  ✓ Cerrar
                </button>
                <button
                  className={styles.whatsappDoneBtn}
                  onClick={() => window.open('https://wa.me/573183592598', '_blank', 'noopener')}
                  type="button"
                >
                  💬 Contactar por WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
