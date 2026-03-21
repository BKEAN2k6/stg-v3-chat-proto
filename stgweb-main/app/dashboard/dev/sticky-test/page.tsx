'use client';

import {useState, useEffect} from 'react';
import {useWindowScroll} from 'react-use';

const StickyTest = () => {
  const [isSticky, setIsSticky] = useState(false);
  const scroll = useWindowScroll();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    console.log('s', scrollTop);
    setIsSticky(scrollTop >= 50);
  };

  useEffect(() => {
    console.log(scroll.y);
  }, [scroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 z-10 h-[50px] w-full border border-red-500 bg-white">
        top
      </div>
      <div className="mt-[50px] h-[50px] border border-orange-500">avatar</div>
      <nav
        className={`border border-green-500 bg-white ${
          isSticky ? 'sticky top-[50px]' : ''
        }`}
      >
        navi
      </nav>
      <main className="flex-1">
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
        <div className="mb-8">Content</div>
      </main>
    </div>
  );
};

export default StickyTest;
