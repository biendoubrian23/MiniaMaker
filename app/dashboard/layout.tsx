// Dashboard Layout avec Sidebar et burger menu mobile
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading, sessionChecked } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Rediriger vers auth si non connecté (après vérification session)
    useEffect(() => {
        if (mounted && sessionChecked && !loading && !user) {
            router.push('/auth');
        }
    }, [mounted, sessionChecked, loading, user, router]);

    // Afficher un loader pendant la vérification
    if (!mounted || loading || !sessionChecked) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-youtubeRed border-r-transparent mb-4"></div>
                    <div className="text-xl font-bold text-black">Chargement...</div>
                </div>
            </div>
        );
    }

    // Redirection en cours
    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-youtubeRed border-r-transparent mb-4"></div>
                    <div className="text-xl font-bold text-black">Redirection...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header mobile avec burger menu */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b-4 border-black px-4 py-3 flex items-center justify-between">
                {/* Burger menu button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo */}
                <h1 className="text-xl font-bold text-black">
                    Make<span className="text-youtubeRed">Minia</span>
                </h1>

                {/* Credits badge */}
                {profile && (
                    <div className="px-3 py-1 bg-youtubeRed text-white font-bold text-sm border-2 border-black">
                        {profile.credits}
                    </div>
                )}
            </header>

            {/* Sidebar - cachée par défaut sur mobile, avec props pour contrôle */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Contenu principal */}
            <main className="md:ml-64 min-h-screen pt-16 md:pt-0">
                {children}
            </main>
        </div>
    );
}
