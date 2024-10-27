'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

// Definer type for søknadsdata
interface SoknadData {
  navn: string;
  epost: string;
  beskrivelse: string;
  soknadstype: string; 
  belop?: number; 
  kontonummer?: string; 
  tillatelsestype?: string; 
  firma?: string; 
}

const SoknadSkjema = () => {
  const { type } = useParams(); 

  // Hvis type er undefined, setter vi en fallback eller håndterer feilen
  const soknadstype = Array.isArray(type) ? type[0] : type || 'ukjent'; 

  // Legg til state for feltene
  const [navn, setNavn] = useState('');
  const [epost, setEpost] = useState('');
  const [beskrivelse, setBeskrivelse] = useState('');
  const [belop, setBelop] = useState('');
  const [kontonummer, setKontonummer] = useState('');
  const [tillatelsestype, setTillatelsestype] = useState('');
  const [firma, setFirma] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Lag soknadData basert på type
    const soknadData: SoknadData = {
      navn,
      epost,
      beskrivelse,
      soknadstype,
      firma,  
    };

    // Legg til felter som er spesifikke for økonomiske søknader
    if (soknadstype === 'okonomi') {
      soknadData.belop = parseInt(belop);
      soknadData.kontonummer = kontonummer;
    }

    // Legg til felter som er spesifikke for tillatelsessøknader
    if (soknadstype === 'tillatelse') {
      soknadData.tillatelsestype = tillatelsestype;
    }

    try {
      const response = await fetch('/api/soknad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soknadData),
      });

      if (response.ok) {
        await response.json();
        alert('Søknaden ble sendt inn!');
        // Tilbakestill feltene
        setNavn('');
        setEpost('');
        setBeskrivelse('');
        setBelop('');
        setFirma('');
        setKontonummer('');
        setTillatelsestype('');
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
      {/* Tilbakeknapp */}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="navn" className="block text-gray-700 font-medium">
            Navn: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="navn"
            name="navn"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            required
          />
        </div>
        
        <div>
         <label htmlFor="firma" className='block text-gray-700 font-medium'>Firma</label>
         <input type="text"
         id='firma'
         name='firma'
         className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
         value={firma}
         onChange={(e) => setFirma(e.target.value)}
         required
          />
        </div>

        <div>
          <label htmlFor="epost" className="block text-gray-700 font-medium">
            E-post: <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="epost"
            name="epost"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="beskrivelse" className="block text-gray-700 font-medium">
            Søknadstekst: <span className="text-red-500">*</span>
          </label>
          <textarea
            id="beskrivelse"
            name="beskrivelse"
            rows={5}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Beskriv søknaden her"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            required
          />
        </div>

        {type === 'okonomi' && (
          <>
            <div>
              <label htmlFor="belop" className="block text-gray-700 font-medium">
                Beløp: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="belop"
                name="belop"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={belop}
                onChange={(e) => setBelop(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="kontonummer" className="block text-gray-700 font-medium">
                Kontonummer: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kontonummer"
                name="kontonummer"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={kontonummer}
                onChange={(e) => setKontonummer(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {type === 'tillatelse' && (
          <div>
            <label htmlFor="tillatelsestype" className="block text-gray-700 font-medium">
              Tillatelsestype :
            </label>
            <input
              type="text"
              id="tillatelsestype"
              name="tillatelsestype"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={tillatelsestype}
              onChange={(e) => setTillatelsestype(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Send Søknad
        </button>
      </form>
    </div>
  );
};

export default SoknadSkjema;
