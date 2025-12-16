// Sidebar pour le dashboard - avec support mobile burger menu
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

interface NavItem {
    href: string;
    icon: React.ReactNode;
    labelKey: string;
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { profile, signOut, loading } = useAuth();
    const { t } = useTranslation();

    const navItems: NavItem[] = [
        {
            href: '/dashboard/workspace',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            labelKey: 'sidebar.workspace',
        },
        {
            href: '/dashboard/storage',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            labelKey: 'sidebar.storage',
        },
        {
            href: '/dashboard/pricing',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            labelKey: 'sidebar.pricing',
        },
        {
            href: '/dashboard/settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            labelKey: 'sidebar.settings',
        },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const handleNavClick = () => {
        // Fermer le menu sur mobile après navigation
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay pour mobile */}
            {isOpen && onClose && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-white border-r-4 border-black h-screen flex flex-col fixed left-0 top-0 z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                {/* Header avec bouton fermer sur mobile */}
                <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between">
                    <Link href="/" onClick={handleNavClick}>
                        <div>
                            <h1 className="text-2xl font-bold text-black cursor-pointer">
                                Make<span className="text-youtubeRed">Minia</span>
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">{t('header.subtitle')}</p>
                        </div>
                    </Link>
                    {/* Bouton fermer sur mobile */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* User Info + Credits */}
                {profile && (
                    <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-youtubeRed text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-black text-sm truncate">
                                    {profile.full_name || profile.email}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-bold border ${profile.subscription_tier === 'pro'
                                        ? 'bg-yellow-400 text-black border-yellow-600'
                                        : profile.subscription_tier === 'starter'
                                            ? 'bg-blue-500 text-white border-blue-700'
                                            : 'bg-gray-200 text-gray-700 border-gray-400'
                                        }`}>
                                        {profile.subscription_tier === 'pro' ? '⭐ PRO' :
                                            profile.subscription_tier === 'starter' ? '🚀 STARTER' :
                                                '🆓 FREE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Credits */}
                        <div className="mt-3 p-3 bg-white border-2 border-black">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">{t('sidebar.credits')}</span>
                                <span className="text-lg font-bold text-youtubeRed">{profile.credits}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={handleNavClick}>
                            <div
                                className={`
                                    flex items-center gap-3 px-4 py-3 font-medium transition-all duration-200 border-2
                                    ${isActive(item.href)
                                        ? 'bg-youtubeRed text-white border-youtubeRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        : 'bg-white text-black border-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                    }
                                `}
                            >
                                {item.icon}
                                <span>{t(item.labelKey)}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t-2 border-gray-200 space-y-3">
                    {/* Language Selector */}
                    <div className="flex items-center justify-center">
                        <LanguageSelector variant="desktop" />
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            signOut();
                            if (onClose) onClose();
                        }}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{t('sidebar.logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
