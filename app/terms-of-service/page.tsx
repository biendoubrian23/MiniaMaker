// Page Conditions d'Utilisation
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'Utilisation | MakeMinia',
  description: 'Conditions générales d\'utilisation de MakeMinia - Service de génération de miniatures YouTube par IA.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-black mb-8 border-b-4 border-youtubeRed pb-4">
          Conditions d'Utilisation
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant MakeMinia (accessible via faireuneminiature.fr), vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">2. Description du service</h2>
            <p>
              MakeMinia est un service en ligne qui permet de générer des miniatures pour vidéos YouTube grâce à l'intelligence artificielle. Le service utilise vos images (visage, inspiration) et vos descriptions textuelles pour créer des miniatures personnalisées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">3. Inscription et compte</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous devez créer un compte pour utiliser nos services de génération.</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants de connexion.</li>
              <li>Vous devez fournir des informations exactes lors de l'inscription.</li>
              <li>Vous devez avoir au moins 18 ans ou avoir l'autorisation parentale pour utiliser ce service.</li>
              <li>Un compte par personne est autorisé.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">4. Système de crédits</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Crédits gratuits :</strong> Chaque nouveau compte reçoit 3 crédits gratuits pour tester le service.</li>
              <li><strong>Pack Starter :</strong> 10 crédits pour 4,99€</li>
              <li><strong>Pack Pro :</strong> 25 crédits pour 9,99€</li>
              <li>1 crédit = 1 miniature générée</li>
              <li>Les crédits achetés n'expirent pas et restent associés à votre compte.</li>
              <li>Les crédits ne sont pas remboursables une fois achetés.</li>
              <li>Les crédits ne sont pas transférables entre comptes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">5. Utilisation acceptable</h2>
            <p className="mb-4">Vous vous engagez à NE PAS utiliser notre service pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Créer du contenu illégal, diffamatoire, menaçant ou harcelant</li>
              <li>Générer des images à caractère pornographique ou sexuellement explicite</li>
              <li>Usurper l'identité d'une autre personne sans son consentement</li>
              <li>Créer du contenu violant les droits d'auteur ou marques déposées</li>
              <li>Générer du contenu de haine, discriminatoire ou incitant à la violence</li>
              <li>Créer du contenu impliquant des mineurs de manière inappropriée</li>
              <li>Contourner les limitations techniques du service</li>
              <li>Revendre ou redistribuer le service sans autorisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">6. Droits sur les images</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Vos images :</strong> Vous conservez tous les droits sur les images que vous téléchargez.</li>
              <li><strong>Miniatures générées :</strong> Vous êtes propriétaire des miniatures générées et pouvez les utiliser librement pour vos vidéos YouTube ou autres usages personnels/commerciaux.</li>
              <li><strong>Licence limitée :</strong> Vous nous accordez une licence limitée pour traiter vos images uniquement dans le cadre de la génération de miniatures.</li>
              <li><strong>Consentement :</strong> Vous garantissez avoir les droits nécessaires sur les images téléchargées (notamment le consentement des personnes photographiées).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">7. Paiements et facturation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les paiements sont traités de manière sécurisée par Stripe.</li>
              <li>Les prix sont affichés en euros (€) TTC.</li>
              <li>Le paiement est dû immédiatement lors de l'achat de crédits.</li>
              <li>Une facture/reçu est disponible après chaque achat.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">8. Politique de remboursement</h2>
            <p className="mb-4">
              Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après l'achat.
            </p>
            <p>
              Cependant, si vous rencontrez un problème technique nous empêchant de fournir le service, nous pouvons étudier votre demande de remboursement au cas par cas. Contactez-nous à <a href="mailto:contact@faireuneminiature.fr" className="text-youtubeRed hover:underline">contact@faireuneminiature.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">9. Disponibilité du service</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nous nous efforçons de maintenir le service disponible 24h/24, 7j/7.</li>
              <li>Des interruptions peuvent survenir pour maintenance ou mises à jour.</li>
              <li>Nous ne garantissons pas une disponibilité de 100%.</li>
              <li>La qualité des miniatures générées peut varier selon les images fournies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">10. Limitation de responsabilité</h2>
            <p>
              Dans les limites autorisées par la loi, MakeMinia ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service. Notre responsabilité totale ne peut excéder le montant que vous avez payé pour le service au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">11. Propriété intellectuelle</h2>
            <p>
              Le site MakeMinia, son design, son code, ses logos et marques sont notre propriété exclusive. Toute reproduction ou utilisation non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">12. Résiliation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous pouvez supprimer votre compte à tout moment.</li>
              <li>Nous pouvons suspendre ou supprimer votre compte en cas de violation de ces conditions.</li>
              <li>En cas de résiliation, les crédits non utilisés ne sont pas remboursés.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">13. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications importantes vous seront notifiées par email. Votre utilisation continue du service après modification constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">14. Droit applicable</h2>
            <p>
              Ces conditions sont régies par le droit français. En cas de litige, les tribunaux français seront compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">15. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation :<br />
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
