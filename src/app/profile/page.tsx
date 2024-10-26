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
}

const UserProfile = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    const fetchApplications = async () => {
      const userId = localStorage.getItem("userId");
      
      if (userId) {
        const res = await fetch(`/api/soknader?userId=${userId}`);
        const data = await res.json();
        setApplications(data);
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
              <p><strong>Navn:</strong> {app.navn}</p>
              <p><strong>Epost:</strong> {app.epost}</p>
              <p><strong>Beskrivelse:</strong> {app.beskrivelse}</p>
              <p><strong>Søknadstype:</strong> {app.soknadstype}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Opprettet:</strong> {new Date(app.opprettetDato).toLocaleDateString()}</p>
              {app.firma && <p><strong>Firma:</strong> {app.firma}</p>}
              {app.belop && <p><strong>Beløp:</strong> {app.belop}</p>}
              {app.kontonummer && <p><strong>Kontonummer:</strong> {app.kontonummer}</p>}
              {app.begrunnelse && <p><strong>Begrunnelse:</strong> {app.begrunnelse}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;
