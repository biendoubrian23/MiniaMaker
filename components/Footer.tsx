// Composant Footer
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Make<span className="text-youtubeRed">Minia</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Créez des miniatures YouTube professionnelles en quelques secondes grâce à l'intelligence artificielle.
            </p>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/dashboard/workspace" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Mon espace
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Informations légales</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <a href="mailto:contact@faireuneminiature.fr" className="text-gray-400 hover:text-youtubeRed transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} MakeMinia - FaireUneMiniature.fr. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Propulsé par l'IA Gemini
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
