import React, { useState, useEffect } from 'react';

interface AgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  agent: {
    name: string;
    image: string | null;
    bgColor: string;
    gradient: string;
    color: string;
    description: string;
    role?: string;
    roleDescription?: string;
    features?: { title: string; description: string; }[];
  } | null;
}

export default function AgentsModal({ isOpen, onClose, isDarkMode, agent }: AgentsModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen || !agent) return null;

  const accentGradient = agent.gradient || agent.bgColor || 'from-purple-600 via-pink-500 to-orange-500';
  const accentColor = agent.color || 'purple';
  const features = agent.features || [
    { title: 'AI-powered spam filtering', description: 'Advanced automation' },
    { title: 'Smart reply generation', description: 'Advanced automation' },
    { title: 'Instant FAQ responses', description: 'Advanced automation' },
    { title: 'Priority inbox sorting', description: 'Advanced automation' },
    { title: 'Follow-up tracking', description: 'Advanced automation' },
    { title: 'Sentiment analysis', description: 'Advanced automation' },
  ];
  const role = agent.role || 'Email Assistant';
  const roleDescription = agent.roleDescription || 'Your intelligent inbox companion';

  return (
    <>
      {/* Backdrop with solid color */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100 backdrop-blur-xl' : 'opacity-0 backdrop-blur-0'
        }`}
        style={{
          background: 'rgba(20, 20, 30, 0.92)'
        }}
        onClick={handleClose}
      >
       

        {/* Main Modal */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={`relative w-full max-w-6xl transform transition-all duration-700 ${
              isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
          
            
            {/* Main container */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              {/* Close button - positioned at top right of modal */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group z-30"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col lg:flex-row min-h-[600px]">
                
                {/* Left Panel - Agent Visual */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  {/* Dynamic background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-90`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                  </div>
                  
                 
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                    {/* Agent Avatar */}
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-500">
                        {agent.image ? (
                          <video
                            src={agent.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                            <div className="text-6xl font-bold text-white/80">{agent.name.charAt(0)}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                    </div>
                    
                    {/* Agent name */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mt-8 mb-4 tracking-tight">
                      {agent.name}
                    </h1>
                    
                    {/* Role badge */}
                    <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium tracking-wide">
                      <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                      {role}
                    </div>
                    
                    {/* Play instruction */}
                    <p className="text-white/80 mt-6 text-sm font-light">
                      {agent.image ? 'Click to interact with me' : 'Ready to assist you'}
                    </p>
                  </div>
                </div>

                {/* Right Panel - Content */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center bg-white/5 backdrop-blur-sm">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-1 h-12 bg-gradient-to-b ${accentGradient} rounded-full`}></div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{roleDescription}</h2>
                        <p className="text-white/60 text-sm">Powered by Simplabots</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                      {agent.description || `Meet ${agent.name}, your next-generation digital assistant. I leverage cutting-edge AI to transform how you manage communications, offering intelligent automation, predictive responses, and seamless workflow integration.`}
                    </p>
                  </div>

                  {/* Capabilities */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Core Capabilities
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                          style={{
                            animationDelay: `${idx * 100}ms`,
                            animation: isVisible ? 'slideInUp 0.6s ease-out forwards' : 'none'
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mt-1`}>
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                              <p className="text-white/50 text-sm">{feature.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Favorite button */}
                  <div className="flex justify-center">
                    <button className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${accentGradient} text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group`}>
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}