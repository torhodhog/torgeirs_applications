// components/SoknadSkjema.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OkonomiSoknad from '../../../components/Soknader/OkonomiSoknad';
import TillatelseSoknad from '../../../components/Soknader/TillatelseSoknad';
// import ReiseregningSoknad from '../../../components/Soknader/Reiseregning';

// Definer en type for søknadsdataene
interface SoknadData {
  navn: string;
  epost: string;
  beskrivelse: string;
  soknadstype: string;
  firma?: string;
  belop?: number;
  kontonummer?: string;
  tillatelsestype?: string;
  type_id: string;
}

const SoknadSkjema = () => {
  const { type } = useParams();

  // Velg riktig komponent basert på type
  let SelectedSoknadComponent;
  if (type === 'okonomi') {
    SelectedSoknadComponent = OkonomiSoknad;
  } else if (type === 'tillatelse') {
    SelectedSoknadComponent = TillatelseSoknad;
  } 
  // else if (type === 'reiseregning') {
  //   SelectedSoknadComponent = ReiseregningSoknad;
  // }
  
  else {
    return <p className="text-red-500">Ugyldig søknadstype valgt.</p>;
  }

  const handleSubmit = async (soknadData: SoknadData) => {
    // Lag en ny kopi av soknadData og filtrer ut tomme eller udefinerte felter
    const cleanedData = Object.fromEntries(
      Object.entries(soknadData).filter(([_, value]) => value !== undefined && value !== '')
    ) as SoknadData;
  
    try {
      const response = await fetch('/api/soknad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
  
      if (response.ok) {
        alert('Søknaden ble sendt inn!');
      } else {
        alert('Feil ved innsending av søknad.');
      }
    } catch (error) {
      console.error('Feil:', error);
      alert('Noe gikk galt ved innsending.');
    }
  };
  

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

      {/* Render den valgte søknadskomponenten med onSubmit-funksjon */}
      <SelectedSoknadComponent onSubmit={handleSubmit} />
    </div>
  );
};

export default SoknadSkjema;
