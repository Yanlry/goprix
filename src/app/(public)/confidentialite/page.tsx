import { LegalLayout, LegalSection, LegalList, LegalPlaceholder } from "@/components/common/LegalLayout";

export const metadata = { title: "Politique de confidentialité — Goprix" };

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="13 septembre 2026">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données personnelles collectées sur ce site est{" "}
          <LegalPlaceholder>[Raison sociale à compléter]</LegalPlaceholder> (voir nos{" "}
          <a href="/mentions-legales" className="text-[#7C3AED] font-medium hover:underline">
            mentions légales
          </a>
          ). Pour toute question relative à vos données, contactez-nous à{" "}
          <LegalPlaceholder>contact@goprix.fr</LegalPlaceholder>.
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <LegalList
          items={[
            <>Données de compte : nom, prénom, email, mot de passe (chiffré)</>,
            <>Données de réservation : produits réservés, magasin, créneau de retrait, historique de commandes</>,
            <>Messages échangés avec le service client</>,
            <>Préférence de consentement aux cookies</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Finalités du traitement">
        <LegalList
          items={[
            "Création et gestion de votre compte client",
            "Traitement de vos réservations Click & Collect",
            "Communication avec vous (confirmation de commande, service client)",
            "Amélioration du site et de nos services",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Base légale">
        <p>
          Ces traitements sont fondés sur l&apos;exécution du contrat qui vous lie à Goprix (gestion de
          compte et de réservations) et, le cas échéant, sur votre consentement (cookies non essentiels).
        </p>
      </LegalSection>

      <LegalSection title="5. Durée de conservation">
        <p>
          Vos données de compte sont conservées tant que votre compte est actif. Les données de réservation
          sont conservées 3 ans à compter de la dernière commande à des fins de preuve et de gestion des
          garanties légales, conformément aux délais de prescription applicables.
        </p>
      </LegalSection>

      <LegalSection title="6. Destinataires des données">
        <p>
          Vos données sont hébergées par nos sous-traitants techniques : <strong>Supabase Inc.</strong>{" "}
          (base de données et authentification) et <strong>Vercel Inc.</strong> (hébergement du site). Les
          emails transactionnels sont envoyés via <strong>Resend</strong>. Aucune donnée n&apos;est vendue
          ou transmise à des fins publicitaires à des tiers.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et
          Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
          limitation, d&apos;opposition et de portabilité de vos données. Pour exercer ces droits,
          contactez-nous à <LegalPlaceholder>contact@goprix.fr</LegalPlaceholder>.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7C3AED] font-medium hover:underline"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="8. Sécurité">
        <p>
          Vos mots de passe sont chiffrés et ne sont jamais accessibles en clair. L&apos;accès à vos données
          est protégé par authentification et des règles de sécurité au niveau de la base de données.
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies">
        <p>
          L&apos;utilisation des cookies est détaillée dans notre{" "}
          <a href="/cookies" className="text-[#7C3AED] font-medium hover:underline">
            politique de cookies
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
