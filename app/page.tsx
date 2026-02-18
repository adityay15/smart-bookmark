import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkManager from '@/components/BookmarkManager'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <BookmarkManager
          initialBookmarks={bookmarks || []}
          userId={user.id}
        />
      </div>
    </div>
  )
}
