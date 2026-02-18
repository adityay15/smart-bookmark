'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import BookmarkItem, { Bookmark } from './BookmarkItem'
import AddBookmark from './AddBookmark'
import { useRouter } from 'next/navigation'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface BookmarkManagerProps {
    initialBookmarks: Bookmark[]
    userId: string
}

export default function BookmarkManager({ initialBookmarks, userId }: BookmarkManagerProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])
    const channelRef = useRef<RealtimeChannel | null>(null)

    useEffect(() => {
        const channel = supabase
            .channel('bookmark-sync')
            .on('broadcast', { event: 'insert' }, ({ payload }) => {
                const newBookmark = payload.bookmark as Bookmark
                setBookmarks((curr) => {
                    if (curr.some(b => b.id === newBookmark.id)) return curr
                    return [newBookmark, ...curr]
                })
            })
            .on('broadcast', { event: 'delete' }, ({ payload }) => {
                setBookmarks((curr) => curr.filter((b) => b.id !== (payload.id as string)))
            })
            .subscribe()

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
            channelRef.current = null
        }
    }, [supabase, userId])

    const addBookmark = useCallback(async (title: string, url: string) => {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert({ title, url, user_id: userId })
            .select()
            .single()

        if (error) throw error

        setBookmarks((curr) => {
            if (curr.some(b => b.id === data.id)) return curr
            return [data, ...curr]
        })

        if (channelRef.current) {
            await channelRef.current.send({
                type: 'broadcast',
                event: 'insert',
                payload: { bookmark: data },
            })
        }
    }, [supabase, userId])

    const deleteBookmark = useCallback(async (id: string) => {
        setBookmarks((curr) => curr.filter((b) => b.id !== id))

        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            const { data } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
            if (data) setBookmarks(data)
            return
        }

        if (channelRef.current) {
            await channelRef.current.send({
                type: 'broadcast',
                event: 'delete',
                payload: { id },
            })
        }
    }, [supabase, userId])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 48,
                    paddingBottom: 24,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #0891b2, #3b82f6)',
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 12px rgba(6,182,212,0.2)',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)" />
                            <circle cx="12" cy="9" r="1" fill="white" opacity="0.8" />
                            <circle cx="9.5" cy="12" r="0.6" fill="white" opacity="0.5" />
                            <circle cx="14.5" cy="12" r="0.6" fill="white" opacity="0.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>
                            My Bookmarks
                        </h1>
                        <p style={{ color: '#52525b', fontSize: '0.8rem', margin: 0, marginTop: 2 }}>
                            {bookmarks.length} link{bookmarks.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        fontSize: '0.8rem',
                        color: '#71717a',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fafafa'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717a'
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                </button>
            </header>

            <div style={{ marginBottom: 32 }}>
                <AddBookmark onAdd={addBookmark} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bookmarks.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            background: 'rgba(255,255,255,0.01)',
                            borderRadius: 16,
                            border: '1px dashed rgba(255,255,255,0.06)',
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.6 }}>📑</div>
                        <p style={{ color: '#52525b', fontSize: '1rem', margin: 0 }}>No bookmarks yet</p>
                        <p style={{ color: '#3f3f46', fontSize: '0.85rem', marginTop: 6 }}>Click above to add your first link</p>
                    </div>
                ) : (
                    bookmarks.map((bookmark) => (
                        <BookmarkItem
                            key={bookmark.id}
                            bookmark={bookmark}
                            onDelete={deleteBookmark}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
