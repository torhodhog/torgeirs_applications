'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface ApplicationDetail {
  _id: string;
  navn: string;
  epost: string;
  beskrivelse: string;
  soknadstype: string;
  firma?: string;
  belop?: number;
  kontonummer?: string;
  tillatelsestype?: string;
  begrunnelse?: string;
  status: string;
  feedback?: string;
}

const ApplicationDetailPage = () => {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        console.log("Fetching application with ID:", id); // Log ID-en for verifisering
  
        // Merk at `id` må være riktig og samsvare med rutenavn
        const res = await fetch(`/api/soknad/${id}`);
        
        if (!res.ok) {
          throw new Error(`Søknad ikke funnet eller annen feil. Status: ${res.status}`);
        }
  
        const data = await res.json();
        console.log("Application data received:", data); // Log mottatt data
        setApplication(data);
      } catch (error) {
        console.error("Feil ved henting av søknad:", error);
      }
    };
  
    if (id) fetchApplication();
  }, [id]);
  

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/soknad/${id}`, { // Oppdater URL til `/api/soknad/${id}`
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, feedback }),
      });
      
      if (!response.ok) {
        throw new Error(`Feil ved oppdatering av søknadsstatus. Status: ${response.status}`);
      }
      
      alert(`Søknad ${newStatus.toLowerCase()}!`);
      router.push(`/adminpage?updated=${Date.now()}`); // Tving en oppdatering i AdminPage
    } catch (error) {
      console.error("Feil ved oppdatering av søknadsstatus:", error);
    }
  };
  

  if (!application) return <p>Laster søknadsdetaljer...</p>;

  return (
    <div className="application-detail max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Søknadsdetaljer</h1>
      <p><strong>Navn:</strong> {application.navn}</p>
      <p><strong>E-post:</strong> {application.epost}</p>
      <p><strong>Beskrivelse:</strong> {application.beskrivelse}</p>
      <p><strong>Type:</strong> {application.soknadstype}</p>
      {application.firma && <p><strong>Firma:</strong> {application.firma}</p>}
      {application.belop && <p><strong>Beløp:</strong> {application.belop} kr</p>}
      {application.kontonummer && <p><strong>Kontonummer:</strong> {application.kontonummer}</p>}
      {application.tillatelsestype && <p><strong>Tillatelsestype:</strong> {application.tillatelsestype}</p>}
      {application.begrunnelse && <p><strong>Begrunnelse:</strong> {application.begrunnelse}</p>}
      {application.status && <p><strong>Status:</strong> {application.status}</p>}
      {application.feedback && <p><strong>Tilbakemelding:</strong> {application.feedback}</p>}

      <h2 className="text-xl font-semibold mt-6">Tilbakemelding</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 mt-2 border rounded-md"
        placeholder="Skriv din tilbakemelding her"
      />

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleStatusUpdate('godkjent')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Godkjenn
        </button>
        <button
          onClick={() => handleStatusUpdate('avslått')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Avslå
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;