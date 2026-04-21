import React from 'react';
import { Link } from 'react-router-dom';

export default function StepBar({ currentStep }) {
  const steps = [
    { id: 1, name: 'Hoa', path: '/custom-flowers', completedColor: '#AF2E38', activeColor: '#AF2E38', inactiveColor: '#B8DAFF', textColor: '#AF2E38' },
    { id: 2, name: 'Lá', path: '/custom-leaves', completedColor: '#AF2E38', activeColor: '#4A90C4', inactiveColor: '#B8DAFF', textColor: 'black' },
    { id: 3, name: 'Túi', path: '/custom-bags', completedColor: '#AF2E38', activeColor: '#4A90C4', inactiveColor: '#B8DAFF', textColor: 'black' },
    { id: 4, name: 'Xem Trước', path: '/custom-preview', completedColor: '#AF2E38', activeColor: '#4A90C4', inactiveColor: '#B8DAFF', textColor: 'black', isAI: true },
    { id: 5, name: 'Thiệp', path: '/custom-cards', completedColor: '#AF2E38', activeColor: '#4A90C4', inactiveColor: '#B8DAFF', textColor: 'black' },
    { id: 6, name: 'Thanh toán', path: '/cart', completedColor: '#AF2E38', activeColor: '#4A90C4', inactiveColor: '#B8DAFF', textColor: 'black' },
  ];

  return (
    <div className="w-full py-4 md:py-10 mt-2 md:mt-0 relative">
      <div className="max-w-[1000px] mx-auto relative px-2 md:px-12">
        <div className="w-full relative">
          
          {/* Horizontal Line Connecting All Steps */}
          <div className="absolute top-[16px] md:top-[28px] left-[8%] right-[8%] h-[1px] bg-black z-0"></div>

          <div className="flex flex-row justify-between items-start md:items-center relative z-10 w-full">
            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isPending = step.id > currentStep;
              
              let circleBg = step.inactiveColor;
              if (isCompleted || isActive) circleBg = step.completedColor;
              
              const StepWrapper = (isCompleted || isActive) ? Link : 'div';
              const wrapperProps = (isCompleted || isActive) ? { to: step.path } : {};

              return (
                <StepWrapper key={step.id} {...wrapperProps} className="flex flex-col items-center gap-1 md:gap-2 group cursor-pointer flex-1">
                  <div className="flex flex-col items-center relative h-8 md:h-16 justify-center">
                    {step.isAI ? (
                        <div className={`w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform ${isActive ? 'scale-110 shadow-md ring-2 ring-offset-2 ring-[#AF2E38]' : ''}`} style={{ backgroundColor: circleBg }}>
                          <svg width="16" height="16" className="md:w-[26px] md:h-[26px]" viewBox="0 0 24 24" fill="none" stroke={isActive || isCompleted ? "white" : "#4A90C4"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="2"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(60 12 12)"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(120 12 12)"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(180 12 12)"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(240 12 12)"/>
                            <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(300 12 12)"/>
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-8 h-8 md:w-14 md:h-14 rounded-full transition-transform ${isActive ? 'scale-110 shadow-md ring-2 ring-offset-2 ring-[#AF2E38]' : ''}`} style={{ backgroundColor: circleBg }}></div>
                      )
                    }
                  </div>
                  <div className={`text-[10px] sm:text-xs md:text-xl font-extralight font-['Geologica'] transition-colors text-center mt-1 md:mt-2 -ml-2 -mr-2 md:-ml-4 md:-mr-4 leading-tight ${isActive ? 'font-medium' : ''}`} style={{ color: isActive ? '#AF2E38' : 'black' }}>
                    {step.name}
                  </div>
                </StepWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
