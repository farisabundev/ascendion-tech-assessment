'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks: string[] = [
  'Showcase',
  'Docs',
  'Blog',
  'Analytics',
  'Commerce',
  'Templates',
  'Enterprise',
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
  }, [pathname])

  return (
    <>
      {/* desktop navbar */}
      <nav className="hidden md:flex justify-between items-center px-6 py-4 border-b">
        <div className="flex space-x-6 items-center">
          <Link
            href="/challenge1"
            className="font-bold text-lg"
          >
            AEON
          </Link>
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm text-gray-700 hover:text-black">
              {link}
            </a>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Search documentation..."
            className="bg-gray-100 rounded px-3 py-1 text-sm mr-2"
          />
          <Link
            href="/challenge2"
            className="bg-neutral-900 text-sm text-white p-2 rounded cursor-pointer inline-block"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* mobile navbar */}
      <nav className="flex md:hidden justify-between items-center px-4 py-4 border-b">
        <Link
          href="/challenge1"
          className="font-bold text-lg"
        >
          AEON
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col border">
          <div className="flex justify-between items-center px-4 py-4 border-b">
            {showSearch ? (
              <div className="flex w-full mr-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            ) :
              <Link
                href="/challenge1"
                className="font-bold text-lg"
              >
                AEON
              </Link>
            }

            <div className="flex items-center space-x-4">
              <button onClick={() => setShowSearch(!showSearch)}>
                <Search size={20} />
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a key={link} href="#" className="text-lg text-gray-800 hover:text-black">
                {link}
              </a>
            ))}
            <a key="login" href="/challenge2" className="text-lg text-gray-800 hover:text-black">Login</a>
          </div>
        </div>
      )}
    </>
  );
}
