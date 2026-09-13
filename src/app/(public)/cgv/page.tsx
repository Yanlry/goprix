import { LegalLayout, LegalSection, LegalList, LegalPlaceholder } from "@/components/common/LegalLayout";

export const metadata = { title: "Conditions Générales de Vente — Goprix" };

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions Générales de Vente" updatedAt="13 septembre 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits proposés sur le
          site Goprix, exploité par <LegalPlaceholder>[Raison sociale à compléter]</LegalPlaceholder>{" "}
          (voir nos{" "}
          <a href="/mentions-legales" className="text-[#7C3AED] font-medium hover:underline">
            mentions légales
          </a>
          ). Toute réservation sur le site implique l&apos;acceptation sans réserve des présentes CGV.
        </p>
      </LegalSection>

      <LegalSection title="2. Fonctionnement du Click &amp; Collect">
        <p>
          Goprix fonctionne exclusivement en <strong>Click &amp; Collect</strong> : aucune livraison à
          domicile n&apos;est proposée. Le client sélectionne ses produits en ligne, choisit un magasin et un
          créneau de retrait, puis valide sa réservation.
        </p>
        <p>
          La réservation en ligne est <strong>gratuite et sans engagement</strong>. Aucun paiement
          n&apos;est effectué au moment de la réservation : le règlement intervient exclusivement en
          magasin, au moment du retrait, par carte bancaire, espèces, chèque, PayPal ou Apple Pay.
        </p>
        <p>
          Les articles réservés sont mis de côté pendant <strong>48 heures</strong>. Passé ce délai, la
          réservation est automatiquement annulée et les produits sont remis en vente.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). Goprix se réserve le droit de
          modifier ses prix à tout moment, les produits étant facturés sur la base du tarif en vigueur au
          moment de la validation de la réservation.
        </p>
      </LegalSection>

      <LegalSection title="4. Disponibilité des produits">
        <p>
          Les offres sont valables dans la limite des stocks disponibles en magasin, tels qu&apos;indiqués
          sur le site. En cas d&apos;indisponibilité d&apos;un produit après réservation, le client en est
          informé et la réservation de l&apos;article concerné est annulée sans frais.
        </p>
      </LegalSection>

      <LegalSection title="5. Annulation">
        <p>
          Le client peut annuler sa réservation gratuitement depuis son espace « Mon compte », jusqu&apos;à
          1 heure avant le créneau de retrait choisi.
        </p>
      </LegalSection>

      <LegalSection title="6. Droit de rétractation">
        <p>
          Conformément à l&apos;article L221-18 du Code de la consommation, le droit de rétractation de 14
          jours s&apos;applique aux contrats conclus à distance. Dans le cadre du Click &amp; Collect Goprix,
          la réservation en ligne est gratuite et sans paiement : la vente n&apos;est conclue qu&apos;au
          moment du paiement effectué en magasin, en présence du client. Le contrat de vente n&apos;étant
          donc pas conclu à distance, le droit de rétractation ne s&apos;applique pas à l&apos;achat
          lui-même — le client reste libre d&apos;annuler sa réservation sans frais avant le retrait (voir
          article 5).
        </p>
      </LegalSection>

      <LegalSection title="7. Garanties légales">
        <LegalList
          items={[
            <>Garantie légale de conformité (articles L217-3 et suivants du Code de la consommation)</>,
            <>Garantie légale des vices cachés (articles 1641 et suivants du Code civil)</>,
          ]}
        />
        <p>
          Tous les produits vendus sur Goprix sont neufs, sous emballage d&apos;origine, et bénéficient de
          ces garanties légales.
        </p>
      </LegalSection>

      <LegalSection title="8. Médiation à la consommation">
        <p>
          En cas de litige non résolu directement avec Goprix, le client peut recourir gratuitement à un
          médiateur de la consommation : <LegalPlaceholder>[nom et coordonnées du médiateur à compléter]</LegalPlaceholder>.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable">
        <p>Les présentes CGV sont soumises au droit français.</p>
      </LegalSection>
    </LegalLayout>
  );
}
