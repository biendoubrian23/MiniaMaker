// Page Politique de Confidentialité
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | MakeMinia',
  description: 'Politique de confidentialité de MakeMinia - Découvrez comment nous protégeons vos données personnelles.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-black mb-8 border-b-4 border-youtubeRed pb-4">
          Politique de Confidentialité
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
            <p>
              Bienvenue sur MakeMinia (accessible via faireuneminiature.fr). Nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre service de génération de miniatures YouTube par intelligence artificielle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Données collectées</h2>
            <p className="mb-4">Nous collectons les types de données suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données d'inscription :</strong> Adresse email, nom complet lors de la création de votre compte.</li>
              <li><strong>Images téléchargées :</strong> Les photos de visage et images d'inspiration que vous uploadez pour générer des miniatures.</li>
              <li><strong>Données de paiement :</strong> Traitées de manière sécurisée par notre partenaire Stripe. Nous ne stockons pas vos informations de carte bancaire.</li>
              <li><strong>Données d'utilisation :</strong> Historique de génération, nombre de crédits, préférences.</li>
              <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, pour améliorer notre service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Utilisation des données</h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir notre service de génération de miniatures IA</li>
              <li>Gérer votre compte et vos crédits</li>
              <li>Traiter vos paiements de manière sécurisée</li>
              <li>Améliorer nos algorithmes et la qualité des miniatures générées</li>
              <li>Vous envoyer des informations importantes concernant votre compte</li>
              <li>Répondre à vos demandes de support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Stockage des images</h2>
            <p>
              Les images que vous téléchargez (visages, inspirations) sont stockées de manière sécurisée sur les serveurs Supabase. Les miniatures générées sont conservées dans votre espace personnel et peuvent être supprimées à tout moment par vous. Nous ne partageons jamais vos images avec des tiers sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Intelligence Artificielle</h2>
            <p>
              Nos miniatures sont générées par l'API Google Gemini. Les images que vous soumettez sont transmises à ce service uniquement pour la génération. Nous vous encourageons à consulter la politique de confidentialité de Google pour plus d'informations sur leur traitement des données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Partage des données</h2>
            <p className="mb-4">Nous partageons vos données uniquement avec :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe :</strong> Pour le traitement sécurisé des paiements</li>
              <li><strong>Supabase :</strong> Pour l'hébergement de la base de données et l'authentification</li>
              <li><strong>Google (Gemini) :</strong> Pour la génération des miniatures par IA</li>
              <li><strong>Vercel :</strong> Pour l'hébergement de notre application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données : chiffrement SSL/TLS, authentification sécurisée, accès restreint aux données. Cependant, aucune méthode de transmission sur Internet n'est totalement sécurisée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Vos droits (RGPD)</h2>
            <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@faireuneminiature.fr" className="text-youtubeRed hover:underline">contact@faireuneminiature.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Cookies</h2>
            <p>
              Nous utilisons des cookies essentiels pour le fonctionnement de notre service (authentification, session). Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Conservation des données</h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles et images sont supprimées dans un délai de 30 jours, sauf obligation légale de conservation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">11. Modifications</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité. Les modifications importantes vous seront notifiées par email ou via notre site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">12. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité :<br />
              Email : <a href="mailto:contact@faireuneminiature.fr" className="text-youtubeRed hover:underline">contact@faireuneminiature.fr</a><br />
              Site : <a href="https://www.faireuneminiature.fr" className="text-youtubeRed hover:underline">www.faireuneminiature.fr</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
