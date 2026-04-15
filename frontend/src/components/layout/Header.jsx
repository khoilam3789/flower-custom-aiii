import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-Color-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 h-20 md:h-24 flex items-center justify-between relative">
        
        {/* Mobile Menu Button - Left */}
        <div className="lg:hidden flex-1">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-Color hover:text-rose-700 transition p-2 -ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Left Links - Desktop */}
        <nav className="hidden lg:flex flex-1 space-x-8 text-Color font-medium uppercase text-[13px] xl:text-sm font-sans tracking-wider">
          <Link to="/" className="hover:text-rose-700 transition">Trang Chủ</Link>
          <Link to="/about" className="hover:text-rose-700 transition whitespace-nowrap">Về Chúng Tôi</Link>
          <Link to="/custom-flowers" className="hover:text-rose-700 transition whitespace-nowrap">Thiết Kế Túi</Link>
        </nav>

        {/* Logo - Center */}
        <div className="flex-1 flex justify-center">
          <Link to="/">
            <h1 className="text-5xl md:text-6xl text-Color-2 font-['Italianno'] font-normal leading-none cursor-pointer">
              Dear, Chérie
            </h1>
          </Link>
        </div>

        {/* Right Links & Icons - Desktop */}
        <div className="hidden lg:flex flex-1 justify-end items-center space-x-6 xl:space-x-8 font-medium uppercase text-[13px] xl:text-sm font-sans tracking-wider text-rose-700">
          <Link to="/story" className="hover:text-Color transition whitespace-nowrap">Ngôn Ngữ Hoa</Link>
          <Link to="/faq" className="hover:text-Color transition whitespace-nowrap">Liên Hệ</Link>
          
          <div className="flex items-center space-x-4 pl-4 xl:pl-6 border-l border-rose-700/20">
            <Link to="/login" className="text-Icon-Default-Default hover:text-Color transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
            <Link to="/cart" className="text-Icon-Default-Default hover:text-Color transition relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile Icons - Right */}
        <div className="lg:hidden flex-1 flex justify-end items-center space-x-3">
          <Link to="/login" className="text-Icon-Default-Default hover:text-rose-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </Link>
          <Link to="/cart" className="text-Icon-Default-Default hover:text-rose-700 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
          </Link>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-rose-700/10 bg-[#FAF9F5] shadow-inner pb-4">
          <nav className="flex flex-col px-6 pt-4 space-y-4 font-medium uppercase text-sm font-sans tracking-wider">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-Color hover:text-rose-700">Trang Chủ</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-Color hover:text-rose-700">Về Chúng Tôi</Link>
            <Link to="/custom-flowers" onClick={() => setIsMenuOpen(false)} className="block text-Color hover:text-rose-700">Thiết Kế Túi</Link>
            <Link to="/story" onClick={() => setIsMenuOpen(false)} className="block text-rose-700 hover:text-Color">Ngôn Ngữ Hoa</Link>
            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block text-rose-700 hover:text-Color">Liên Hệ</Link>
          </nav>
        </div>
      )}

      {/* Notice Banner */}
      <div className="w-full bg-rose-700/60 flex items-center justify-center py-2 h-10 px-4 text-center">
        <span className="text-white text-xs md:text-sm font-light tracking-wide line-clamp-1">
          Đây là website phục vụ môn học Digital Marketing và không nhằm mục đích thương mại
        </span>
      </div>
    </header>
  );
}
