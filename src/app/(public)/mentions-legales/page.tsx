import { LegalLayout, LegalSection, LegalList, LegalPlaceholder } from "@/components/common/LegalLayout";

export const metadata = { title: "Mentions légales — Goprix" };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="13 septembre 2026">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site Goprix est édité par <LegalPlaceholder>[Raison sociale à compléter]</LegalPlaceholder>,{" "}
          <LegalPlaceholder>[forme juridique, ex. SASU]</LegalPlaceholder> au capital de{" "}
          <LegalPlaceholder>[montant] €</LegalPlaceholder>, immatriculée au RCS de{" "}
          <LegalPlaceholder>[ville]</LegalPlaceholder> sous le numéro SIRET{" "}
          <LegalPlaceholder>[numéro SIRET]</LegalPlaceholder>.
        </p>
        <p>
          Siège social : <LegalPlaceholder>[adresse complète]</LegalPlaceholder>
        </p>
        <p>
          Contact : <LegalPlaceholder>contact@goprix.fr</LegalPlaceholder> — Directeur de la publication :{" "}
          <LegalPlaceholder>[nom du responsable]</LegalPlaceholder>
        </p>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789,
          États-Unis (vercel.com).
        </p>
        <p>
          La base de données et les fichiers sont hébergés par <strong>Supabase Inc.</strong>, 970 Toa Payoh
          North #07-04, Singapour (supabase.com).
        </p>
      </LegalSection>

      <LegalSection title="3. Propriété intellectuelle">
        <p>
          L&apos;ensemble des contenus présents sur le site Goprix (textes, images, logos, structure) est
          protégé par le droit d&apos;auteur. Toute reproduction, représentation ou diffusion, totale ou
          partielle, sans autorisation préalable, est interdite.
        </p>
      </LegalSection>

      <LegalSection title="4. Responsabilité">
        <p>
          Goprix s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site, mais
          ne peut garantir l&apos;absence totale d&apos;erreurs. L&apos;utilisateur reconnaît utiliser ces
          informations sous sa responsabilité exclusive.
        </p>
      </LegalSection>

      <LegalSection title="5. Données personnelles et cookies">
        <p>
          Le traitement des données personnelles et l&apos;utilisation des cookies sont détaillés dans notre{" "}
          <a href="/confidentialite" className="text-[#7C3AED] font-medium hover:underline">
            politique de confidentialité
          </a>{" "}
          et notre{" "}
          <a href="/cookies" className="text-[#7C3AED] font-medium hover:underline">
            politique de cookies
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Droit applicable">
        <LegalList
          items={[
            "Le présent site et ses mentions légales sont soumis au droit français.",
            "En cas de litige, et à défaut de résolution amiable, les tribunaux français compétents seront seuls saisis.",
          ]}
        />
      </LegalSection>
    </LegalLayout>
  );
}
