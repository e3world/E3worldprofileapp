import loadingLogo from "@assets/9_1752406728992.png";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img 
          src={loadingLogo}
          alt="E3 Logo"
          className="w-32 h-32 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}