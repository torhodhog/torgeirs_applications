// lib/types.ts
export interface SoknadData {
   navn: string;
   epost: string;
   beskrivelse: string;
   soknadstype: string;
   firma?: string;
   belop?: number;
   kontonummer?: string;
   tillatelsestype?: string;
   reisemal?: string; // For reiseregning
   avreiseDato?: string; // For reiseregning
   hjemkomstDato?: string; // For reiseregning
   transportKostnad?: number; // For reiseregning
   losjiKostnad?: number; // For reiseregning
   andreUtgifter?: number; // For reiseregning
   type_id: string;
 }
 