'use client'

import { useState } from 'react'

export interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

interface BookmarkItemProps {
    bookmark: Bookmark
    onDelete: (id: string) => Promise<void>
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await onDelete(bookmark.id)
        } catch {
            setIsDeleting(false)
        }
    }

    const href = bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`
    let displayUrl = ''
    try {
        displayUrl = new URL(href).hostname
    } catch {
        displayUrl = bookmark.url
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '16px 20px',
                transition: 'all 0.2s',
                transform: isHovered ? 'translateY(-1px)' : 'none',
                boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                        style={{
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            color: 'white',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bookmark.title}
                    </h3>
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 4,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        {displayUrl}
                    </a>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                        padding: 8,
                        color: isHovered ? '#f87171' : '#52525b',
                        background: isHovered ? 'rgba(248,113,113,0.1)' : 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isDeleting ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    title="Delete bookmark"
                >
                    {isDeleting ? (
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                border: '2px solid #f87171',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }}
                        />
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    )
}
