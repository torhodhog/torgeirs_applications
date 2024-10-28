"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import CardHoverEffectDemo from "../../components/CardHoverEffectDemo";
import ProcessedApplicationsGrid from "../../components/ProcessedApplicationsGrid";
import ChartComponent from "../../components/ChartComponent"; // Sørg for at denne importen er riktig

interface Application {
  _id: string;
  soknadstype: string;
  status: "godkjent" | "avslått" | "innsendt";
  belop?: number;
  navn?: string;
  firma?: string;
}

const AdminPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [applicationTypes, setApplicationTypes] = useState<{ [key: string]: number }>({});
  const [statusFilter, setStatusFilter] = useState<"alle" | "godkjent" | "avslått" | "innsendt">("alle");
  const [typeFilter, setTypeFilter] = useState<"alle" | "okonomi" | "tillatelse">("alle");
  const [refresh, setRefresh] = useState(false); 
  const [applicationData, setApplicationData] = useState<{ [key: string]: number }>({});
  const [financeData, setFinanceData] = useState<{ approved: number; rejected: number; total: number }>({
    approved: 0,
    rejected: 0,
    total: 0,
  });
  
  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/soknad"); // Sjekk at ruten er korrekt
      if (!res.ok) {
        console.error("Feil ved henting av søknader:", await res.text());
        return;
      }
      
      const data = await res.json();
      console.log("Hentede søknader:", data); 
  
      setApplications(data);
  
      // Beregn totalbeløp og antall søknader per type
      let total = 0;
      const typesCount: { [key: string]: number } = {};
      data.forEach((app: Application) => {
        if (app.belop) total += app.belop;
        typesCount[app.soknadstype] = (typesCount[app.soknadstype] || 0) + 1;
      });
      setTotalAmount(total);
      setApplicationTypes(typesCount);

      // Beregn finansdata
      const typeCounts: { [key: string]: number } = {};
      let approvedSum = 0;
      let rejectedSum = 0;
      let totalSum = 0;

      data.forEach((app: Application) => {
        typeCounts[app.soknadstype] = (typeCounts[app.soknadstype] || 0) + 1;
        if (app.status === 'godkjent' && app.belop) approvedSum += app.belop;
        if (app.status === 'avslått' && app.belop) rejectedSum += app.belop;
        if (app.belop) totalSum += app.belop;
      });

      setApplicationTypes(typeCounts);
      setFinanceData({ approved: approvedSum, rejected: rejectedSum, total: totalSum });
    } catch (error) {
      console.error("Feil ved henting av søknader:", error);
    }
  };

  // Hent søknader på nytt ved oppdatering av filter og refresh
  useEffect(() => {
    fetchApplications();
  }, [refresh, statusFilter, typeFilter]);

  // Funksjon for å håndtere oppdatering av søknadsstatus
  const handleStatusUpdate = async (id: string, newStatus: "godkjent" | "avslått") => {
    try {
      await fetch(`/api/soknad/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setRefresh(!refresh); // Tving en oppdatering ved å bytte verdien av refresh
    } catch (error) {
      console.error("Feil ved oppdatering av søknadsstatus:", error);
    }
  };

  const processedApplications = applications
    .filter((app) => app.status === "godkjent" || app.status === "avslått")
    .map((app) => ({
      title: app.soknadstype === "okonomi" ? "Økonomi" : "Tillatelse",
      name: app.navn || "Ukjent navn",
      description: app.firma ? `Firma: ${app.firma}` : "Ingen firma oppgitt",
      link: `/applications/${app._id}`,
      status: app.status,
    }));

  // Filtrere søknader basert på valgt status og type
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "alle" || app.status === statusFilter;
    const matchesType = typeFilter === "alle" || app.soknadstype === typeFilter;
    return matchesStatus && matchesType;
  });

  // Mappe filtrerte søknader for visning
  const mappedApplications = filteredApplications.map(app => ({
    id: app._id,
    name: app.navn || "Ukjent navn",
    title: app.soknadstype === "okonomi" ? "Økonomi" : "Tillatelse",
    description: app.firma ? `Firma: ${app.firma} - Søknad ID: ${app._id}` : `Ingen firma oppgitt - Søknad ID: ${app._id}`,
    link: `/applications/${app._id}`,
    status: app.status as "godkjent" | "avslått" 
  }));

  return (
    <div className="admin-panel max-w-6xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Adminpanel</h1>

      {/* Visning av statistikk */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Antall søknader per type</h2>
        <ul>
          {Object.entries(applicationTypes).map(([type, count]) => (
            <li key={type}>
              {type === "okonomi" ? "Økonomi" : "Tillatelse"}: {count}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-4">Totalsum av søkte beløp</h2>
        <p>{totalAmount} kr</p>
      </div>

      {/* Filtreringsalternativer */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="mr-2 font-semibold">Filtrer etter status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "alle" | "godkjent" | "avslått" | "innsendt")}
            className="border px-2 py-1 rounded"
          >
            <option value="alle">Alle</option>
            <option value="innsendt">Ubehandlede</option>
            <option value="godkjent">Godkjente</option>
            <option value="avslått">Avslåtte</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Filtrer etter type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "alle" | "okonomi" | "tillatelse")}
            className="border px-2 py-1 rounded"
          >
            <option value="alle">Alle</option>
            <option value="okonomi">Økonomi</option>
            <option value="tillatelse">Tillatelse</option>
          </select>
        </div>
      </div>

      {/* Utsikt over søknader basert på filter */}
      <MaxWidthWrapper>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {statusFilter === "alle" && typeFilter === "alle" ? "Alle søknader" : `${statusFilter === "alle" ? "" : statusFilter} ${typeFilter === "alle" ? "" : typeFilter}`}
          </h2>
          {statusFilter === "godkjent" || statusFilter === "avslått" ? (
            <ProcessedApplicationsGrid applications={mappedApplications.filter(app => app.status === statusFilter)} />
          ) : (
            <CardHoverEffectDemo applications={mappedApplications} />
          )}
        </div>
        <ProcessedApplicationsGrid applications={mappedApplications} />
        <ChartComponent applicationData={applicationTypes} financeData={financeData} />
      </MaxWidthWrapper>

    </div>
  );
};

export default AdminPage;