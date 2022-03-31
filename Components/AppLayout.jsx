import React from 'react';
import Link from 'next/link';

export default function AppLayout({ children }) {
  return (
    <div className="container px-4 max-w-5xl mx-auto flex flex-col justify-between min-h-screen">
      <header className="bg-gray-100">
        <div className="flex flex-col items-center justify-center flex-wrap sm:flex-row sm:justify-between gap-2 py-6">
          <Link href={'/'}>
            <a>
              <h1 className="flex gap-2 items-center text-3xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-sun">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span className="">WhatsTheWeather</span>
              </h1>
            </a>
          </Link>
          {/* <nav>
            <ul className="flex gap-4 flex-wrap">
              <li>
                <Link href="/">
                  <a className="font-semibold hover:underline">Home</a>
                </Link>
              </li>
            </ul>
          </nav> */}
        </div>
      </header>
      {children}
      <footer className="mt-auto">
        <div className="flex flex-col md:flex-row md:justify-between  items-center text-center gap-2 py-6">
          <p>Copyright@{new Date().getFullYear()}</p>
          <p>Built with AccuWeather API + Next js {'&'} tailwind</p>
        </div>
      </footer>
    </div>
  );
}
