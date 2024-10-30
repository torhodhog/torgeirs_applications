// components/SoknadSkjema.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OkonomiSoknad from '../../../components/Soknader/OkonomiSoknad';
import TillatelseSoknad from '../../../components/Soknader/TillatelseSoknad';

const SoknadSkjema = () => {
  const { type } = useParams();

  // Velg riktig komponent basert på type
  let SelectedSoknadComponent;

  if (type === 'okonomi') {
    SelectedSoknadComponent = OkonomiSoknad;
  } else if (type === 'tillatelse') {
    SelectedSoknadComponent = TillatelseSoknad;
  } else {
    return <p className="text-red-500">Ugyldig søknadstype valgt.</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg mt-24">
      <Link href="/skjemaer" className="text-blue-500 hover:text-blue-700 flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake til skjemaoversikt
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {type === 'okonomi' ? 'Søknad om økonomisk støtte' : 'Tillatelsessøknad'}
      </h1>

      {/* Render den valgte søknadskomponenten */}
      <SelectedSoknadComponent />
    </div>
  );
};

export default SoknadSkjema;
