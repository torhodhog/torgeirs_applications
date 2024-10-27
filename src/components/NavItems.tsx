'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NavItems = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Hent userType fra localStorage når komponenten rendres
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  return (
    <div className="flex gap-4 h-full mt-5">
      {/* Vis lenke basert på brukertype */}
      {userType === "admin" ? (
        <Link href="/adminpage">Admin Panel</Link>
      ) : userType === "user" ? (
        <Link href="/profile">Min Side</Link>
      ) : (
        <Link href="/login">Logg inn</Link>
      )}
    </div>
  );
};

export default NavItems;


