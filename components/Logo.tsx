
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Svg Mark - Zentra Symbol */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Cyan Dot */}
        <circle cx="50" cy="50" r="12" fill="#06b6d4" className="animate-pulse" />
        
        {/* 4 Brackets / Arches */}
        <path 
          d="M25 25C32 18 40 15 50 15C60 15 68 18 75 25" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-slate-900 dark:text-white"
        />
        <path 
          d="M75 75C68 82 60 85 50 85C40 85 32 82 25 75" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-slate-900 dark:text-white"
        />
        <path 
          d="M25 75C18 68 15 60 15 50C15 40 18 32 25 25" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-slate-900 dark:text-white"
        />
        <path 
          d="M75 25C82 32 85 40 85 50C85 60 82 68 75 75" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-slate-900 dark:text-white"
        />
      </svg>
      
      {/* Zentra Typography */}
      <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
        zentra
      </span>
    </div>
  );
};

export default Logo;
