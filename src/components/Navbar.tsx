import Link from "next/link";
import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-pink-200 flex items-center justify-between px-4 z-50">
      {/* HER LAGER JEG MOBILNAV SENERE */}
      <div className="flex items-center">
        <Link href="/" passHref>
          
            <Image
              src="/fjell.png"
              width={150}
              height={80}
              alt="Fjell logo"
            />
      
        </Link>
      </div>
      <div>
        <Link href="/login" className="text-blue-500 hover:text-blue-700">
          Logg inn
        </Link>
      </div>
    </div>
  );
};

export default Navbar;