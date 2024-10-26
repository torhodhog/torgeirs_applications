'use client';

import React, { useEffect, useState } from 'react';

// Definer typen for Application
interface Application {
  _id: string;
  type: string;
  status: string;
}

const UserProfile = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch('/api/soknad'); // Endre til riktig API-endepunkt om nødvendig
      const data = await res.json();
      setApplications(data);
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <h1>Mine Søknader</h1>
      <ul>
        {applications.map((app) => (
          <li key={app._id}>{app.type} - Status: {app.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
