import Link from "next/link";
import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-24 bg-pink-200 flex items-center">
      {/* HER LAGER JEG MOBILNAV SENERE */}
      <div className="ml-4 flex lg:ml-0">
        <Link href="/">
          <Image
            src="/fjell.png"
            width={150}
            height={80}
            alt="Fjell logo"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
