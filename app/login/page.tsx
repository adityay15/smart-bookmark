import LoginButton from "@/components/LoginButton"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-white space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide">
            LinkNest
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Save your links.
            <br />
            Keep them yours.
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            A private bookmark manager built for simplicity.
            Organize what matters and access it instantly —
            from any device.
          </p>

          <div className="text-xs text-slate-500 uppercase tracking-widest">
            Private • Real-time • Secure
          </div>
        </div>

        {/* Right Side - Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Continue with Google
          </h2>

          <LoginButton />

          <p className="text-xs text-slate-500 mt-6">
            We only use Google authentication.  
            No passwords stored.
          </p>
        </div>
      </div>
    </div>
  )
}
