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
    <div className="min-h-screen bg-slate-950 text-white">
        {/* Top Navigation */}
        <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
            <h1 className="text-lg font-semibold tracking-tight">
                LinkNest
            </h1>
            <p className="text-xs text-slate-400">
                Personal Bookmark Manager
            </p>
            </div>

            <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-white/10 
                        text-slate-400 hover:text-white hover:bg-white/5 
                        transition"
            >
            Sign Out
            </button>
        </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">
            My Bookmarks
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
            {bookmarks.length} saved link{bookmarks.length !== 1 ? "s" : ""}
            </p>
        </div>

        {/* Add Bookmark Card */}
        <div className="mb-10 p-6 rounded-2xl bg-slate-900/70 shadow-lx ring-1 ring-inset ring-white/5">
            <AddBookmark onAdd={addBookmark} />
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
            {bookmarks.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-slate-900/40">
                <div className="text-4xl mb-4">🔖</div>
                <p className="text-slate-300 text-lg">
                Nothing saved yet
                </p>
                <p className="text-slate-500 text-sm mt-2">
                Add your first bookmark above to get started.
                </p>
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
    </div>
    )
}
