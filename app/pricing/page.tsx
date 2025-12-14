// Page de tarification
'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function PricingPage() {
  const { t } = useTranslation();
  
  const plans = [
    {
      name: t('pricing.starter'),
      price: '4.99€',
      credits: 10,
      description: t('pricing.starterDesc'),
      features: [
        `10 ${t('pricing.feature1')}`,
        t('pricing.feature2'),
        t('pricing.feature4'),
        t('pricing.feature6'),
      ],
    },
    {
      name: t('pricing.pro'),
      price: '9.99€',
      credits: 25,
      description: t('pricing.proDesc'),
      popular: true,
      features: [
        `25 ${t('pricing.feature1')}`,
        t('pricing.feature3'),
        t('pricing.feature5'),
        t('pricing.feature6'),
        t('pricing.feature7'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Titre */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative bg-white border-4 border-black p-8 transition-all duration-300 hover:scale-105 flex flex-col
                ${plan.popular ? 'shadow-[12px_12px_0px_0px_rgba(255,0,0,1)]' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-youtubeRed text-white px-4 py-1 text-sm font-bold border-2 border-black">
                    {t('pricing.popular')}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-black">{plan.price}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {plan.credits} {t('pricing.credits')} = {plan.credits} {t('pricing.thumbnails')}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-6 h-6 text-youtubeRed mr-2 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`
                  w-full px-6 py-4 text-lg font-bold border-4 border-black transition-all duration-200
                  hover:translate-x-[2px] hover:translate-y-[2px]
                  ${
                    plan.popular
                      ? 'bg-youtubeRed text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
              >
                {t('pricing.buy')}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">{t('pricing.faqTitle')}</h2>
          <div className="space-y-4">
            <div className="bg-white border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">{t('pricing.faq1Q')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq1A')}
              </p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">{t('pricing.faq2Q')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq2A')}
              </p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">{t('pricing.faq3Q')}</h3>
              <p className="text-gray-600">
                {t('pricing.faq3A')}
              </p>
            </div>
          </div>
        </div>

        {/* Retour */}
        <div className="mt-12 text-center">
          <Link href="/">
            <button className="px-8 py-3 bg-white text-black font-bold border-2 border-black hover:bg-black hover:text-white transition-all duration-200">
              {t('pricing.backHome')}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
