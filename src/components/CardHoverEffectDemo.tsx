import React from 'react';
import { HoverEffect } from "./ui/card-hover-effect";

interface AdminApplication {
  title: string;
  name: string;
  description: string;
  link: string;
  status: string;
}

export function CardHoverEffectDemo({ applications }: { applications: AdminApplication[] }) {
  return (
    <div className="max-w-5xl mx-auto px-8 mt-12">
      <div className="flex justify-center items-center">
        <h1 className="text-black font-extrabold">Ubehandlede søknader</h1>
      </div>
      <HoverEffect items={applications.map(app => ({
        title: app.title,
        description: app.description,
        link: app.link,
      }))} />
    </div>
  );
}

export default CardHoverEffectDemo;

