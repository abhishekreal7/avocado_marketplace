export const AvocadoLogo = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Avocado outer shape */}
      <path
        d="M50 10C35 10 25 20 25 35C25 45 20 55 20 65C20 80 32 90 50 90C68 90 80 80 80 65C80 55 75 45 75 35C75 20 65 10 50 10Z"
        fill="url(#avocado-gradient)"
      />
      
      {/* Avocado pit/seed */}
      <ellipse
        cx="50"
        cy="55"
        rx="12"
        ry="15"
        fill="#8B4513"
      />
      
      {/* Highlight on pit */}
      <ellipse
        cx="52"
        cy="50"
        rx="4"
        ry="5"
        fill="#A0522D"
        opacity="0.6"
      />
      
      {/* Leaf accent */}
      <path
        d="M55 15C60 12 68 15 70 20C72 25 70 30 65 32C60 34 55 30 54 25C53 20 52 17 55 15Z"
        fill="#2F5233"
      />
      
      {/* Leaf vein */}
      <path
        d="M59 18L63 28"
        stroke="#1A3A1F"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Inner flesh highlight */}
      <path
        d="M35 40C35 40 38 35 45 35C50 35 55 38 55 43"
        stroke="#E8F5E9"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      
      <defs>
        <linearGradient
          id="avocado-gradient"
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4A7C59" />
          <stop offset="50%" stopColor="#558B2F" />
          <stop offset="100%" stopColor="#33691E" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AvocadoLogoMark = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="50" cy="50" r="45" fill="url(#logo-bg)" />
        <path
          d="M50 20C40 20 35 27 35 37C35 43 32 49 32 55C32 65 39 72 50 72C61 72 68 65 68 55C68 49 65 43 65 37C65 27 60 20 50 20Z"
          fill="url(#avocado-small)"
        />
        <ellipse cx="50" cy="52" rx="7" ry="9" fill="#8B4513" />
        <path
          d="M53 23C56 21 61 23 62 27C63 30 62 33 58 34C55 35 52 32 52 29C51 26 52 24 53 23Z"
          fill="#2F5233"
        />
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#0F392B" />
            <stop offset="100%" stopColor="#1A5C43" />
          </linearGradient>
          <linearGradient id="avocado-small" x1="50" y1="20" x2="50" y2="72">
            <stop offset="0%" stopColor="#A8E6CF" />
            <stop offset="100%" stopColor="#D4F246" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
