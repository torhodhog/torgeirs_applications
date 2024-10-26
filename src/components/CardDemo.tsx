"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CardDemoProps {
  navn: string;
  bildeUrl: string;
  href: string;
  beskrivelse: string;
}

export function CardDemo({ navn, bildeUrl, href, beskrivelse }: CardDemoProps) {
  return (
    <div className="max-w-xs w-full group/card">
      <Link href={href}>
        <div className="cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4">
          <div className="relative w-full h-48">
            <Image
              src={bildeUrl}
              alt={navn}
              layout="fill"
              objectFit="cover"  
              className="rounded-md"
            />
          </div>
          <div className="text content mt-4">
            <h1 className="font-bold text-xl md:text-2xl text-gray-900">
              {navn}
            </h1>
            <p className="font-normal text-sm text-gray-600 my-4">
              {beskrivelse}
            </p>
            <span className="text-blue-500 hover:text-blue-700">Les mer</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardDemo;
