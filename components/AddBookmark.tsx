'use client'

import { useState } from 'react'

interface AddBookmarkProps {
    onAdd: (title: string, url: string) => Promise<void>
}

export default function AddBookmark({ onAdd }: AddBookmarkProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        try {
            setIsSubmitting(true)
            await onAdd(title, url)
            setTitle('')
            setUrl('')
            setIsOpen(false)
        } catch {
            // handled upstream
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#9ca3af',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#9ca3af'
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Bookmark
            </button>
        )
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
        padding: '12px 14px',
        color: 'white',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 24,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white' }}>New Bookmark</h3>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                        color: '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: 4,
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bookmark Title (e.g., My Portfolio)"
                    style={inputStyle}
                    autoFocus
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />

                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="URL (e.g., https://example.com)"
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />

                <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#d1d5db',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.15s',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!title || !url || isSubmitting}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: !title || !url || isSubmitting ? '#1e3a5f' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            cursor: !title || !url || isSubmitting ? 'not-allowed' : 'pointer',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            opacity: !title || !url || isSubmitting ? 0.5 : 1,
                            transition: 'all 0.15s',
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Bookmark'}
                    </button>
                </div>
            </div>
        </form>
    )
}
