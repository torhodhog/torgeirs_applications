'use client';

import React, { useEffect, useState } from 'react';

// Definer typen for Application
interface Application {
  _id: string;
  navn: string;
  epost: string;
  beskrivelse: string;
  soknadstype: string;
  status: string;
  opprettetDato: string;
  firma?: string;
  belop?: number;
  kontonummer?: string;
  begrunnelse?: string;
  type_id: string;
  userId?: string;
  tillatelsestype?: string;
  feedback?: string;
}

const UserProfile = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/soknader');
        if (!res.ok) {
          throw new Error(`Feil ved henting av søknader. Status: ${res.status}`);
        }
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Feil ved henting av søknader:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h1>Mine Søknader</h1>
      {applications.length === 0 ? (
        <p>Du har ingen søknader</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app._id} className="mb-4 p-4 border rounded shadow">
              <p style={{ marginBottom: '10px' }}><strong>Navn:</strong> {app.navn}</p>
              <p style={{ marginBottom: '10px' }}><strong>ID:</strong> {app._id}</p>
              <p style={{ marginBottom: '10px' }}><strong>Type ID:</strong> {app.type_id}</p>
              <p style={{ marginBottom: '10px' }}><strong>Epost:</strong> {app.epost}</p>
              <p style={{ marginBottom: '10px' }}><strong>Beskrivelse:</strong> {app.beskrivelse}</p>
              <p style={{ marginBottom: '10px' }}><strong>Søknadstype:</strong> {app.soknadstype}</p>
              <p style={{ marginBottom: '10px' }}><strong>Status:</strong> {app.status}</p>
              <p style={{ marginBottom: '10px' }}><strong>Opprettet:</strong> {new Date(app.opprettetDato).toLocaleDateString()}</p>
              {app.firma && <p style={{ marginBottom: '10px' }}><strong>Firma:</strong> {app.firma}</p>}
              {app.belop && <p style={{ marginBottom: '10px' }}><strong>Beløp:</strong> {app.belop}</p>}
              {app.kontonummer && <p style={{ marginBottom: '10px' }}><strong>Kontonummer:</strong> {app.kontonummer}</p>}
              {app.tillatelsestype && <p style={{ marginBottom: '10px' }}><strong>Tillatelsestype:</strong> {app.tillatelsestype}</p>}
              {app.begrunnelse && <p style={{ marginBottom: '10px' }}><strong>Begrunnelse:</strong> {app.begrunnelse}</p>}
              {app.feedback && <p style={{ marginBottom: '10px' }}><strong>Tilbakemelding:</strong> {app.feedback}</p>}
              {app.userId && <p style={{ marginBottom: '10px' }}><strong>Bruker ID:</strong> {app.userId}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;