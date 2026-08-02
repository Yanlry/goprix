import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StaticImageData } from "next/image";

import partnerLogo1 from "../../../asset/marques/127d00792377417e5a17c7f60a707b8cae21ee63.png";
import partnerLogo2 from "../../../asset/marques/5856c3c22dd778b7a902383eea5089c7d8cab7a8-300x278.png";
import partnerLogo3 from "../../../asset/marques/747b5e487dd200b1d4242588178984d1496cbedd-300x270.png";
import partnerLogo4 from "../../../asset/marques/943b4f7ce0bae9be1831a0c2b026595bb723fc51.png";
import danoneLogo from "../../../asset/marques/Danone-logo-goprix-1-300x100.png";
import yoplaitLogo from "../../../asset/marques/Yoplait-goprix-300x170.png";
import evianLogo from "../../../asset/marques/evian-goprix-300x188.png";
import partnerLogo5 from "../../../asset/marques/f93dfaa93d365a0923c3b825af4df0cdc3609b8c.png";
import luLogo from "../../../asset/marques/logo-LU-goprix-300x288.jpg";
import lustucruLogo from "../../../asset/marques/logo-lustucru-gopric-300x207.jpg";
import panzaniLogo from "../../../asset/marques/logo-panzani-1024-512-goprix-300x150.jpg";

interface BrandLogo {
  name: string;
  image: StaticImageData;
}

const brandLogos: BrandLogo[] = [
  { name: "Marque partenaire 1", image: partnerLogo1 },
  { name: "Marque partenaire 2", image: partnerLogo2 },
  { name: "Marque partenaire 3", image: partnerLogo3 },
  { name: "Marque partenaire 4", image: partnerLogo4 },
  { name: "Danone", image: danoneLogo },
  { name: "Yoplait", image: yoplaitLogo },
  { name: "Evian", image: evianLogo },
  { name: "Marque partenaire 5", image: partnerLogo5 },
  { name: "LU", image: luLogo },
  { name: "Lustucru", image: lustucruLogo },
  { name: "Panzani", image: panzaniLogo },
];

function BrandCard({ brand }: { brand: BrandLogo }) {
  return (
    <div className="flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/70 sm:h-32 sm:w-52">
      <Image
        src={brand.image}
        alt={`Logo ${brand.name}`}
        className="max-h-full w-auto object-contain"
        sizes="(max-width: 640px) 176px, 208px"
      />
    </div>
  );
}

export function BrandsCarousel() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">Nos Marques</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
              Retrouvez une sélection de marques reconnues avec des arrivages réguliers à prix déstockés.
            </p>
          </div>
          <Link
            href="/marques"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-50"
          >
            Voir toutes les marques
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="brands-carousel relative -mx-4 overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

          <div className="brands-carousel-track flex w-max">
            {[0, 1].map((loopIndex) => (
              <div
                key={loopIndex}
                aria-hidden={loopIndex === 1}
                className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
              >
                {brandLogos.map((brand) => (
                  <BrandCard key={`${loopIndex}-${brand.name}`} brand={brand} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
