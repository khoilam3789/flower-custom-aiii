import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

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
          <Link to="/" className="hover:text-rose-700 transition whitespace-nowrap">Trang Chủ</Link>
          <Link to="/about" className="hover:text-rose-700 transition whitespace-nowrap">Về Chúng Tôi</Link>
          <Link to="/custom-flowers" className="hover:text-rose-700 transition whitespace-nowrap">Thiết Kế Túi</Link>
        </nav>

        {/* Logo - Center */}
        <div className="flex-1 flex justify-center">
          <Link to="/">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-Color-2 font-['Italianno'] font-normal leading-none cursor-pointer whitespace-nowrap">
              Dear, Chérie
            </h1>
          </Link>
        </div>

        {/* Right Links & Icons - Desktop */}
        <div className="hidden lg:flex flex-1 justify-end items-center space-x-6 xl:space-x-8 font-medium uppercase text-[13px] xl:text-sm font-sans tracking-wider text-rose-700">
          <Link to="/story" className="hover:text-Color transition whitespace-nowrap">Ngôn Ngữ Hoa</Link>
          <a href="#contact-footer" className="hover:text-Color transition whitespace-nowrap">Liên Hệ</a>
          
          <div className="flex items-center space-x-4 pl-4 xl:pl-6 border-l border-rose-700/20">
            {user ? (
              <div className="relative flex items-center pr-2">
                <div 
                  className="text-Icon-Default-Default hover:text-Color transition cursor-pointer flex items-center gap-1"
                  onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="text-xs font-bold capitalize hidden xl:block">{user.name.split(' ')[0]}</span>
                </div>
                {/* Desktop Dropdown - Click based */}
                {isDesktopDropdownOpen && (
                  <div className="absolute top-full -right-4 pt-4 z-50">
                    <div className="bg-white border border-rose-100 shadow-2xl rounded-2xl w-48 py-2 flex flex-col normal-case text-slate-800">
                      <div className="px-5 py-2 w-full text-xs text-slate-400 border-b border-rose-50 mb-1 truncate">Xin chào, {user.name}</div>
                      <Link to="/" onClick={() => setIsDesktopDropdownOpen(false)} className="px-5 py-2 w-full text-sm hover:bg-rose-50 hover:text-rose-700 transition text-left cursor-pointer">Hồ sơ của tôi</Link>
                      <Link to="/cart" onClick={() => setIsDesktopDropdownOpen(false)} className="px-5 py-2 w-full text-sm hover:bg-rose-50 hover:text-rose-700 transition text-left cursor-pointer">Giỏ hàng</Link>
                      <div className="border-t border-rose-50 mt-1"></div>
                      <button onClick={() => { logout(); setIsDesktopDropdownOpen(false); }} className="px-5 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition text-left mt-1 font-bold">Đăng xuất</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-Icon-Default-Default hover:text-Color transition" title="Đăng nhập">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
            )}

            <Link to="/cart" className="text-Icon-Default-Default hover:text-Color transition relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-700 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="lg:hidden flex-1 flex justify-end items-center space-x-3">
          {user ? (
            <div className="relative z-50">
              <div 
                className="text-Icon-Default-Default hover:text-rose-700 transition cursor-pointer flex items-center pr-2"
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              {/* Mobile Dropdown - Click based */}
              {isMobileDropdownOpen && (
                <div className="absolute top-full right-[-10px] pt-4 z-50">
                  <div className="bg-white border border-rose-100 shadow-2xl rounded-2xl w-44 py-2 flex flex-col normal-case text-slate-800 tracking-normal">
                    <div className="px-4 py-2 w-full text-xs text-slate-400 border-b border-rose-50 mb-1 truncate">Xin chào, {user.name}</div>
                    <Link to="/" onClick={() => setIsMobileDropdownOpen(false)} className="px-4 py-2 w-full text-sm hover:bg-rose-50 hover:text-rose-700 transition text-left">Hồ sơ của tôi</Link>
                    <Link to="/cart" onClick={() => setIsMobileDropdownOpen(false)} className="px-4 py-2 w-full text-sm hover:bg-rose-50 hover:text-rose-700 transition text-left">Giỏ hàng</Link>
                    <div className="border-t border-rose-50 mt-1"></div>
                    <button onClick={() => { logout(); setIsMobileDropdownOpen(false); }} className="px-4 py-3 w-full text-sm text-red-600 hover:bg-red-50 transition text-left mt-1 font-bold">Đăng xuất</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-Icon-Default-Default hover:text-rose-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            </Link>
          )}
          <Link to="/cart" className="text-Icon-Default-Default hover:text-rose-700 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-700 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartItems.length}
              </span>
            )}
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
            <a href="#contact-footer" onClick={() => setIsMenuOpen(false)} className="block text-rose-700 hover:text-Color">Liên Hệ</a>
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
