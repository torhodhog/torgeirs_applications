// components/OkonomiSoknad.tsx
"use client";

import React, { useState } from 'react';

const OkonomiSoknad = () => {
  const [navn, setNavn] = useState('');
  const [epost, setEpost] = useState('');
  const [beskrivelse, setBeskrivelse] = useState('');
  const [belop, setBelop] = useState('');
  const [kontonummer, setKontonummer] = useState('');
  const [firma, setFirma] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const soknadData = {
      navn,
      epost,
      beskrivelse,
      soknadstype: "okonomi",
      firma,
      belop: parseInt(belop),
      kontonummer,
      type_id: `okonomi-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    };

    try {
      const response = await fetch('/api/soknad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(soknadData),
      });

      if (response.ok) {
        alert('Søknaden ble sendt inn!');
        // Tilbakestill feltene
        setNavn('');
        setEpost('');
        setBeskrivelse('');
        setBelop('');
        setFirma('');
        setKontonummer('');
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Søknad om økonomisk støtte</h1>
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
          <label htmlFor="firma" className="block text-gray-700 font-medium">
            Firma:
          </label>
          <input
            type="text"
            id="firma"
            name="firma"
            placeholder="Fyll ut hvis du søker på vegne av et firma"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
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

export default OkonomiSoknad;
