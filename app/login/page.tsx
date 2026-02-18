import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000000',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.08)',
                    filter: 'blur(120px)',
                    top: -200,
                    left: -100,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.06)',
                    filter: 'blur(100px)',
                    bottom: -100,
                    right: -50,
                }}
            />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 32 }}>
                <div
                    style={{
                        marginBottom: 36,
                        padding: 20,
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 20,
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 0 50px rgba(6,182,212,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)',
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #0891b2 0%, #3b82f6 100%)',
                            borderRadius: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 24px rgba(6,182,212,0.3), 0 10px 15px -3px rgba(0,0,0,0.3)',
                            position: 'relative',
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)" />
                            <circle cx="12" cy="9" r="1.2" fill="white" opacity="0.9" />
                            <circle cx="9" cy="12" r="0.7" fill="white" opacity="0.6" />
                            <circle cx="15" cy="12" r="0.7" fill="white" opacity="0.6" />
                            <circle cx="12" cy="14.5" r="0.5" fill="white" opacity="0.4" />
                            <line x1="12" y1="9" x2="9" y2="12" stroke="white" strokeWidth="0.5" opacity="0.3" />
                            <line x1="12" y1="9" x2="15" y2="12" stroke="white" strokeWidth="0.5" opacity="0.3" />
                            <line x1="9" y1="12" x2="12" y2="14.5" stroke="white" strokeWidth="0.5" opacity="0.3" />
                            <line x1="15" y1="12" x2="12" y2="14.5" stroke="white" strokeWidth="0.5" opacity="0.3" />
                        </svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ position: 'absolute', top: -4, right: -4, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}>
                            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                        </svg>
                    </div>
                </div>

                <h1
                    style={{
                        fontSize: '3.2rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: 16,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                    }}
                >
                    Smart Bookmarks
                </h1>
                <p
                    style={{
                        color: '#71717a',
                        marginBottom: 40,
                        maxWidth: 380,
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                    }}
                >
                    Your AI-powered space for the web. Save, organize, and access your
                    favorite links from anywhere.
                </p>

                <LoginButton />

                <p
                    style={{
                        marginTop: 36,
                        fontSize: '0.7rem',
                        color: '#3f3f46',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                    }}
                >
                    Secure • Private • Realtime
                </p>
            </div>
        </div>
    )
}
