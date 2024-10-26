import React from "react";


interface ProcessedApplication {
  title: string;
  name: string;
  description: string;
  link: string;
  status: "godkjent" | "avslått";
}

interface ProcessedApplicationsGridProps {
  applications: ProcessedApplication[];
}

const ProcessedApplicationsGrid: React.FC<ProcessedApplicationsGridProps> = ({
  applications,
}) => {
  
  const filteredApplications = applications.filter(
    (app) => app.status === "godkjent" || app.status === "avslått"
  );

  return (
    <div className="max-w-5xl mx-auto px-8 mt-12">
      <div className="flex justify-center items-center">
        {/* Eventuelt innhold her */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredApplications.map((app) => (
          <div
            key={app.link}
            className={`p-4 rounded-lg shadow-md ${
              app.status === "godkjent"
                ? "bg-green-500"
                : app.status === "avslått"
                ? "bg-red-500"
                : "bg-gray-500"
            } text-white`}
          >
            <h2 className="font-semibold text-lg">{app.title}</h2>
            <p>{app.description}</p>
            <a href={app.link} className="underline">
              Les mer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessedApplicationsGrid;
