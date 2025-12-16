// Page Tarifs - Dashboard
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

// URLs de paiement Stripe (mode test)
const STRIPE_LINKS = {
    starter: 'https://buy.stripe.com/test_14AeVcfrKbuo4hh1yocV200',
    pro: 'https://buy.stripe.com/test_aFa6oG2EY6a4bJJ90QcV201',
};

export default function PricingPage() {
    const { user, profile } = useAuth();
    const { t } = useTranslation();

    // Construire l'URL Stripe avec l'email pré-rempli
    const getStripeUrl = (baseUrl: string) => {
        if (user?.email) {
            return `${baseUrl}?prefilled_email=${encodeURIComponent(user.email)}`;
        }
        return baseUrl;
    };

    return (
        <div className="p-8 min-h-screen bg-white">
            {/* En-tête */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-black mb-4">{t('pricing.title')}</h1>
                <p className="text-gray-600 text-lg">{t('pricing.subtitle')}</p>

                {profile && (
                    <div className="mt-4 inline-block px-4 py-2 bg-gray-100 border-2 border-black">
                        <span className="text-sm">Crédits actuels: </span>
                        <span className="font-bold text-youtubeRed">{profile.credits}</span>
                    </div>
                )}
            </div>

            {/* Grille de plans */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Plan Starter */}
                <div className="relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                    <h2 className="text-2xl font-bold text-black mb-2">
                        {t('pricing.starter')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('pricing.starterDesc')}
                    </p>

                    {/* Prix */}
                    <div className="mb-6">
                        <span className="text-5xl font-bold text-black">4,99€</span>
                    </div>

                    {/* Crédits */}
                    <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200">
                        <div className="text-3xl font-bold text-youtubeRed">10</div>
                        <div className="text-sm text-gray-600">{t('pricing.credits')}</div>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 space-y-3">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>10 {t('pricing.feature1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature3')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature6')}</span>
                        </li>
                    </ul>

                    {/* Spacer pour aligner le bouton en bas */}
                    <div className="flex-grow"></div>

                    {/* Bouton */}
                    <a
                        href={getStripeUrl(STRIPE_LINKS.starter)}
                        className="block w-full text-center px-6 py-4 font-bold text-lg border-4 border-black transition-all duration-200 bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        {t('pricing.buy')}
                    </a>
                </div>

                {/* Plan Pro */}
                <div className="relative bg-white border-4 border-youtubeRed p-8 shadow-[8px_8px_0px_0px_rgba(255,0,0,1)] flex flex-col">
                    {/* Badge populaire */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-2 bg-youtubeRed text-white font-bold text-sm border-2 border-black">
                            {t('pricing.popular')}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-black mb-2">
                        {t('pricing.pro')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('pricing.proDesc')}
                    </p>

                    {/* Prix */}
                    <div className="mb-6">
                        <span className="text-5xl font-bold text-black">9,99€</span>
                    </div>

                    {/* Crédits */}
                    <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200">
                        <div className="text-3xl font-bold text-youtubeRed">25</div>
                        <div className="text-sm text-gray-600">{t('pricing.credits')}</div>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 space-y-3">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>25 {t('pricing.feature1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature3')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature6')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature5')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{t('pricing.feature7')}</span>
                        </li>
                    </ul>

                    {/* Spacer pour aligner le bouton en bas */}
                    <div className="flex-grow"></div>

                    {/* Bouton */}
                    <a
                        href={getStripeUrl(STRIPE_LINKS.pro)}
                        className="block w-full text-center px-6 py-4 font-bold text-lg border-4 border-black transition-all duration-200 bg-youtubeRed text-white hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        {t('pricing.buy')}
                    </a>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-16">
                <h2 className="text-3xl font-bold text-black mb-8 text-center">{t('pricing.faqTitle')}</h2>
                <div className="space-y-4">
                    <div className="bg-white border-2 border-black p-6">
                        <h3 className="font-bold text-lg mb-2">{t('pricing.faq1Q')}</h3>
                        <p className="text-gray-600">{t('pricing.faq1A')}</p>
                    </div>
                    <div className="bg-white border-2 border-black p-6">
                        <h3 className="font-bold text-lg mb-2">{t('pricing.faq2Q')}</h3>
                        <p className="text-gray-600">{t('pricing.faq2A')}</p>
                    </div>
                    <div className="bg-white border-2 border-black p-6">
                        <h3 className="font-bold text-lg mb-2">{t('pricing.faq3Q')}</h3>
                        <p className="text-gray-600">{t('pricing.faq3A')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
