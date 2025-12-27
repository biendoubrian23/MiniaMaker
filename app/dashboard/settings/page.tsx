// Page Paramètres - Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
    const { user, profile, refreshProfile } = useAuth();
    const { t } = useTranslation();
    
    // Récupérer le nom depuis Google si le profil n'en a pas
    const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Mettre à jour fullName quand profile ou user change
    useEffect(() => {
        setFullName(profile?.full_name || googleName);
    }, [profile, googleName]);

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (error) {
            console.error('Erreur:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 min-h-screen">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black">Paramètres</h1>
                <p className="text-gray-600 mt-1">Gérez votre profil et vos préférences</p>
            </div>

            <div className="max-w-2xl space-y-8">
                {/* Section Profil */}
                <section className="bg-white border-2 border-black p-6">
                    <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informations du profil
                    </h2>

                    <div className="space-y-4">
                        {/* Email (lecture seule) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 text-gray-600 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                        </div>

                        {/* Nom complet */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nom complet</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-black focus:border-youtubeRed focus:outline-none transition-colors"
                                placeholder="Votre nom"
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`p-4 border-2 ${message.type === 'success'
                                    ? 'bg-green-50 border-green-500 text-green-700'
                                    : 'bg-red-50 border-red-500 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Bouton sauvegarder */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-youtubeRed hover:border-youtubeRed transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </section>

                {/* Section Abonnement */}
                <section className="bg-white border-2 border-black p-6">
                    <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Abonnement & Crédits
                    </h2>

                    <div className="space-y-4">
                        {/* Statut actuel */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200">
                            <div>
                                <p className="font-bold">Plan actuel</p>
                                <p className="text-sm text-gray-600">
                                    {profile?.subscription_tier === 'pro' ? 'Pro' :
                                        profile?.subscription_tier === 'starter' ? 'Starter' :
                                            'Gratuit'}
                                </p>
                            </div>
                            <span className={`px-4 py-2 font-bold border-2 ${profile?.subscription_tier === 'pro'
                                    ? 'bg-yellow-400 text-black border-yellow-600'
                                    : profile?.subscription_tier === 'starter'
                                        ? 'bg-blue-500 text-white border-blue-700'
                                        : 'bg-gray-200 text-gray-700 border-gray-400'
                                }`}>
                                {profile?.subscription_tier === 'pro' ? '⭐ PRO' :
                                    profile?.subscription_tier === 'starter' ? '🚀 STARTER' :
                                        '🆓 FREE'}
                            </span>
                        </div>

                        {/* Crédits */}
                        <div className="flex items-center justify-between p-4 bg-youtubeRed/10 border-2 border-youtubeRed">
                            <div>
                                <p className="font-bold">Crédits disponibles</p>
                                <p className="text-sm text-gray-600">1 crédit = 1 génération de miniature</p>
                            </div>
                            <span className="text-4xl font-bold text-youtubeRed">
                                {profile?.credits || 0}
                            </span>
                        </div>

                        {/* Bouton acheter */}
                        <a
                            href="/dashboard/pricing"
                            className="inline-block px-6 py-3 bg-youtubeRed text-white font-bold border-2 border-black hover:bg-red-600 transition-colors"
                        >
                            Acheter des crédits
                        </a>
                    </div>
                </section>

                {/* Section Compte */}
                <section className="bg-white border-2 border-black p-6">
                    <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Compte
                    </h2>

                    <p className="text-gray-600 mb-4">
                        Membre depuis le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                    </p>
                </section>
            </div>
        </div>
    );
}
