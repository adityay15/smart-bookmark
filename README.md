# Smart Bookmark App

A premium, realtime bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Features

- **Google OAuth**: Seamless login without passwords.
- **Realtime Sync**: Updates instantly across all open tabs and devices.
- **Privacy First**: Row Level Security (RLS) ensures your data is yours alone.
- **Premium Design**: Modern dark UI with glassmorphism and smooth animations.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Setup Instructions

1.  **Clone and Install**:
    ```bash
    git clone <your-repo-url>
    cd smart-bookmark-app
    npm install
    ```

2.  **Environment Variables**:
    Create `.env.local` with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Auth Configuration (Crucial)**:
    - **Google Cloud Console**:
        - Go to APIs & Services > Credentials > OAuth 2.0 Client IDs.
        - Add this to **Authorized redirect URIs**:
          `https://<your-project-ref>.supabase.co/auth/v1/callback`
    - **Supabase Dashboard**:
        - Go to Authentication > Providers > Google.
        - Enable Google and paste your Client ID and Secret.
        - Go to Authentication > URL Configuration.
        - Add `http://localhost:3000/auth/callback` to **Redirect URLs**.

4.  **Database Setup**:
    - If you haven't already, run the SQL in `schema.sql` in your Supabase SQL Editor.
    - *Note: If you created the table and policies manually, you can skip this step.*

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## Challenges & Solutions

### 1. Realtime Updates across Clients
**Problem**: Keeping the UI in sync when a bookmark is added from another tab without refreshing.
**Solution**: Implemented `supabase.channel` in `BookmarkManager.tsx` to subscribe to Postgres changes (`INSERT`, `UPDATE`, `DELETE`) on the `bookmarks` table. This allows the client to react instantly to database events.

### 2. Secure Data Access
**Problem**: Ensuring User A cannot access User B's bookmarks.
**Solution**: Enabled Row Level Security (RLS) on the `bookmarks` table. Created rigorous policies that enforce `auth.uid() = user_id` for all operations (SELECT, INSERT, UPDATE, DELETE).

### 3. Middleware for Auth
**Problem**: Next.js Server Components need access to the auth session, but cookies need to be refreshed.
**Solution**: Created a robust middleware (`utils/supabase/middleware.ts`) that intercepts requests and refreshes the Supabase session, ensuring the user remains logged in and Server Components have access to valid cookies.

### 4. Premium Aesthetic
**Problem**: Default Tailwind styles can look generic.
**Solution**: Custom-designed a dark theme using gradients, backdrop-blur (glassmorphism), and subtle hover animations to create a high-quality "app-like" feel.
