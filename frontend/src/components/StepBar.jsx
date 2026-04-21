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
    <div className="w-full py-6 md:py-10 px-4 mt-16 md:mt-0">
      <div className="max-w-[1000px] mx-auto relative">
        
        {/* Desktop Line */}
        <div className="hidden md:block absolute top-[20px] left-[40px] right-[40px] h-[1px] bg-black z-0"></div>

        {/* Mobile Line (Vertical) */}
        <div className="md:hidden absolute top-[20px] bottom-[20px] left-[20px] w-[1px] bg-black z-0"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6 md:gap-0 pl-2 md:pl-0">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isPending = step.id > currentStep;
            
            let circleBg = step.inactiveColor;
            if (isCompleted) circleBg = step.completedColor;
            if (isActive) circleBg = step.completedColor; // Or activeColor depending on design, using completedColor to match original active state
            
            let textColor = step.textColor;
            // if (isCompleted || isActive) textColor = step.activeColor || step.completedColor; // adjust if you want color change on text

            const StepWrapper = (isCompleted || isActive) ? Link : 'div';
            const wrapperProps = (isCompleted || isActive) ? { to: step.path } : {};

            return (
              <StepWrapper key={step.id} {...wrapperProps} className="flex md:flex-col items-center gap-4 md:gap-2 group cursor-pointer w-full md:w-auto">
                <div className="flex flex-col items-center relative">
                  {step.isAI ? 
                    (
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-transform ${isActive ? 'scale-110 shadow-md' : ''}`} style={{ backgroundColor: circleBg }}>
                        <svg width="24" height="24" className="md:w-[30px] md:h-[30px]" viewBox="0 0 24 24" fill="none" stroke={isActive || isCompleted ? "white" : "#4A90C4"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
                      <div className={`w-10 h-10 rounded-full transition-transform ${isActive ? 'scale-110 shadow-md ring-2 ring-offset-2 ring-[#AF2E38]' : ''}`} style={{ backgroundColor: circleBg }}></div>
                    )
                  }
                </div>
                <div className={`text-xl md:text-2xl font-extralight font-['Geologica'] md:mt-2 transition-colors ${isActive ? 'font-normal' : ''}`} style={{ color: isActive ? '#AF2E38' : 'black' }}>
                  {step.name}
                </div>
              </StepWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
