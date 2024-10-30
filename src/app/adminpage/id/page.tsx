"use client";

import React, { useEffect, useState } from "react";

interface ApplicationId {
  _id: string;
}

const ApplicationIdsPage = () => {
  const [applicationIds, setApplicationIds] = useState<string[]>([]);

  // Funksjon for å hente alle søknads-ID-er
  const fetchApplicationIds = async () => {
    try {
      const res = await fetch("/api/soknad"); // Bruk samme API-endepunkt for å hente alle søknader
      if (!res.ok) {
        console.error("Feil ved henting av søknads-IDer:", await res.text());
        return;
      }

      const data = await res.json();
      setApplicationIds(data.map((app: ApplicationId) => app._id)); // Hent kun ID-er fra dataen
    } catch (error) {
      console.error("Feil ved henting av søknads-IDer:", error);
    }
  };

  // Hent søknads-ID-er ved sideinnlasting
  useEffect(() => {
    fetchApplicationIds();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg mt-24">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Liste over alle søknads-ID-er</h1>
      <ul>
        {applicationIds.map((id) => (
          <li key={id} className="text-gray-700 mb-2">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationIdsPage;
