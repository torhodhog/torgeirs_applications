// // components/ReiseregningSoknad.tsx
// "use client";

// import React, { useState } from 'react';
// import { SoknadData } from '../../lib/types';

// interface ReiseregningSoknadProps {
//   onSubmit: (data: SoknadData) => Promise<void>;
// }

// const ReiseregningSoknad: React.FC<ReiseregningSoknadProps> = ({ onSubmit }) => {
//   const [navn, setNavn] = useState('');
//   const [epost, setEpost] = useState('');
//   const [reisemal, setReisemal] = useState('');
//   const [avreiseDato, setAvreiseDato] = useState('');
//   const [hjemkomstDato, setHjemkomstDato] = useState('');
//   const [transportKostnad, setTransportKostnad] = useState('');
//   const [losjiKostnad, setLosjiKostnad] = useState('');
//   const [andreUtgifter, setAndreUtgifter] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const soknadData: SoknadData = {
//       navn,
//       epost,
//       beskrivelse: "Reiseregning",
//       soknadstype: "reiseregning",
//       reisemal,
//       avreiseDato,
//       hjemkomstDato,
//       transportKostnad: transportKostnad ? parseFloat(transportKostnad) : undefined,
//       losjiKostnad: losjiKostnad ? parseFloat(losjiKostnad) : undefined,
//       andreUtgifter: andreUtgifter ? parseFloat(andreUtgifter) : undefined,
//       type_id: `reiseregning-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
//     };

//     await onSubmit(soknadData);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg mt-24">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Reiseregning</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="navn" className="block text-gray-700 font-medium">
//             Navn: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="navn"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={navn}
//             onChange={(e) => setNavn(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="epost" className="block text-gray-700 font-medium">
//             E-post: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             id="epost"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={epost}
//             onChange={(e) => setEpost(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="reisemal" className="block text-gray-700 font-medium">
//             Reisemål: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="reisemal"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={reisemal}
//             onChange={(e) => setReisemal(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="avreiseDato" className="block text-gray-700 font-medium">
//             Avreisedato: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             id="avreiseDato"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={avreiseDato}
//             onChange={(e) => setAvreiseDato(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="hjemkomstDato" className="block text-gray-700 font-medium">
//             Hjemkomstdato: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             id="hjemkomstDato"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={hjemkomstDato}
//             onChange={(e) => setHjemkomstDato(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="transportKostnad" className="block text-gray-700 font-medium">
//             Transportkostnader: <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             id="transportKostnad"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={transportKostnad}
//             onChange={(e) => setTransportKostnad(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="losjiKostnad" className="block text-gray-700 font-medium">
//             Losjikostnader:
//           </label>
//           <input
//             type="number"
//             id="losjiKostnad"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={losjiKostnad}
//             onChange={(e) => setLosjiKostnad(e.target.value)}
//           />
//         </div>

//         <div>
//           <label htmlFor="andreUtgifter" className="block text-gray-700 font-medium">
//             Andre utgifter:
//           </label>
//           <input
//             type="number"
//             id="andreUtgifter"
//             className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             value={andreUtgifter}
//             onChange={(e) => setAndreUtgifter(e.target.value)}
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//         >
//           Send Reiseregning
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ReiseregningSoknad;
