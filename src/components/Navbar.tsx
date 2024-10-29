'use client'

import Link from "next/link";
import React from "react";
import Image from "next/image";
import NavItems from "./NavItems";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isAdminPage = pathname === "/adminpage";

  return (
    <div className={`fixed top-0 left-0 w-full h-16 ${isAdminPage ? 'bg-blue-200' : 'bg-pink-200'} flex items-center justify-between px-4 z-50 overflow-hidden`}>
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
        {/* <NavItems /> */}
      </div>
    </div>
  );
};

export default Navbar;