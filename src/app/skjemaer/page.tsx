'use client'


import CardDemo from '../../components/CardDemo';
import React from 'react';

const HomePage = () => {
  return (
    <>
 
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
    
      <CardDemo
  navn="Økonomisk Støtte"
  bildeUrl="/penger.jpg"  
  href="/soknad/okonomi"
  beskrivelse="Søk om økonomisk støtte for prosjekter og arrangementer."
/>
<CardDemo
  navn="Tillatelsessøknad"
  bildeUrl="/tilttak.jpg"
  href="/soknad/tillatelse"
  beskrivelse="Søk om tillatelse for byggeprosjekter eller andre formål."
/>


       
      </div>
      
    </div></>
  );
};

export default HomePage;