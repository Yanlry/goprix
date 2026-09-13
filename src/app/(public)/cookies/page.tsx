import { LegalLayout, LegalSection, LegalList } from "@/components/common/LegalLayout";

export const metadata = { title: "Politique de cookies — Goprix" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Politique de cookies" updatedAt="13 septembre 2026">
      <LegalSection title="1. Qu'est-ce qu'un cookie ?">
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la visite d&apos;un site, qui
          permet notamment de mémoriser vos préférences ou de maintenir votre session connectée.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies utilisés sur Goprix">
        <p>À ce jour, Goprix n&apos;utilise aucun cookie publicitaire ni aucun outil de mesure d&apos;audience tiers. Seuls des éléments strictement nécessaires au fonctionnement du site sont utilisés :</p>
        <LegalList
          items={[
            <><strong>Session d&apos;authentification</strong> : nécessaire pour rester connecté à votre compte.</>,
            <><strong>Panier et préférences locales</strong> : stockés sur votre appareil pour retrouver votre panier entre deux visites.</>,
            <><strong>Choix de consentement aux cookies</strong> : mémorise votre réponse (Accepter/Refuser) à la bannière, afin de ne pas vous la réafficher à chaque visite.</>,
          ]}
        />
        <p>
          Ces éléments étant strictement nécessaires au fonctionnement du site, ils ne requièrent pas de
          consentement au sens de la réglementation CNIL. La bannière de consentement est néanmoins
          affichée à titre de bonne pratique et de transparence.
        </p>
      </LegalSection>

      <LegalSection title="3. Évolution future">
        <p>
          Si Goprix venait à intégrer des outils de mesure d&apos;audience ou des cookies publicitaires,
          cette page serait mise à jour et votre consentement explicite serait recueilli avant tout dépôt de
          ces cookies non essentiels.
        </p>
      </LegalSection>

      <LegalSection title="4. Gérer votre choix">
        <p>
          Vous pouvez à tout moment effacer les cookies et données locales de votre navigateur depuis ses
          paramètres. La suppression des données locales du site réaffichera la bannière de consentement
          lors de votre prochaine visite.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
