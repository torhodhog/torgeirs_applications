import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { buttonVariants } from "../components/ui/button";
import { FileText, Gauge } from "lucide-react";
import Link from "next/link";
import React from "react";

const perks = [
  {
    name: "Hurtig svar",
    Icon: Gauge,
    description: "Vi gir deg svar på dagen",
  },
  {
    name: "Legg til dokumenter",
    Icon: FileText,
    description: "Legg til dokumenter for å få en bedre søknad",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mt-36 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Vi gjør søknader enkelt{" "}
            <span className="text-green-600">for alle.</span>
          </h1>
          <p className="mt-6 text-large max-w-prose text-muted-foreground">
            Søk enkelt og greit, få svar på dagen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/skjemaer" className={buttonVariants()}>
              Se alle søknadskjemaer &rarr;
            </Link>
            <Link href="/login" className={buttonVariants({variant: "secondary"})}>
              Logg inn
              </Link>
          </div>
        </div>

        {/* Her kan jeg legge inn bilder med søknadstyper */}
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50 ">
        <MaxWidthWrapper className="py-20">
          <div className=" grid grid-cols-1 pag-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-2 lg:gap-x-10  lg:gap-y-0 ">
            {perks.map((perk, index) => {
              return (
                <div key={index} className="flex flex-col items-center">
                  <perk.Icon className="w-12 h-12 text-green-600" />
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-2 text-lg text-gray-500">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
