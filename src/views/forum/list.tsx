import React, { useState, useEffect,useRef  } from 'react';
import {useSearchParams } from 'react-router-dom';
import ForumLayout from "./layout"
import { FaAngleLeft, FaAnglesLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { supabase } from "lib/supabase";
import { SkeletonList } from "components/skeleton/forum";
import { CallRow } from "./components/CallRow";

const options = ["All Ranks", "Level 1", "Level 2", "Level 3","Level 4","Level 5","Level 6","Level 7","Level 8","Level 9","Level 10"];

function useOutsideAlerter(ref: any, setX: any): void {
  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
    // Unbind the event listener on clean up
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

const ForumList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"featured" | "latest">(searchParams.get('type') as "featured" | "latest" || 'latest');
  const [isLoading, setIsLoading] = useState(true);
  const [callList, setCallList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(searchParams.get('level') || "All Ranks");
  const wrapperRef = React.useRef(null);
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [showPagination, setShowPagination] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [isPaginationVisible, setPaginationVisible] = useState(true);
  const hideTimer = useRef(null);
 const [inputValue, setInputValue] = useState<string>(String(page));

  useOutsideAlerter(wrapperRef, setIsOpen);
  useEffect(() => {
    setInputValue(String(page));
    setIsLoading(true);
    const fetchCalls = async() => {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage;
    const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .order("created_at", { ascending: false });
     if (error) {
        console.error("Error fetching calls:", error.message);
        return;
     }
     if (activeTab==null || activeTab == "latest") {
       if (filters == "All Ranks" || filters == null) {
         setCallList(data.filter(call => call.is_featured === false).slice(from, to));
         setTotalPages(Math.ceil(data.filter(call => call.is_featured === false).length / 6));
         }
       else {
         setCallList((data.filter(call => call.is_featured === false)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)).slice(from, to));
         setTotalPages(Math.ceil((data.filter(call => call.is_featured === false)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)).length / 6));
       }
     }
     else if (activeTab == "featured") {
       if (filters == "All Ranks" || filters ==null) {
         setCallList(data.filter(call => call.is_featured === true).slice(from, to));
         setTotalPages(Math.ceil(data.filter(call => call.is_featured === true).length / 6));
       }
       else {
         setCallList((data.filter(call => call.is_featured === true)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)).slice(from, to));
         setTotalPages(Math.ceil((data.filter(call => call.is_featured === true)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)).length / 6));
       }
     }
       setIsLoading(false);
    }
    fetchCalls();   
 
  const channel = supabase
        .channel("calls")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, fetchCalls)
        .subscribe();
     
  window.addEventListener("mousemove", handleMouseMove);
    
  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("mousemove", handleMouseMove);
    }

  }, [filters, activeTab, page]);
  
  const handleMouseMove = () => {
    // setPaginationVisible(true);
    // // Reset timer
    // if (hideTimer.current) clearTimeout(hideTimer.current);
    // // Hide after 2 seconds
    // hideTimer.current = setTimeout(() => {
    //   setPaginationVisible(false);
    // }, 8000);
  };

  const featuredlist = () => {
    setActiveTab("featured");
    setSearchParams({ type: "featured", level: filters });
    setPage(1);
  }
  
  const lastestlist = () => {
    setActiveTab("latest");
    setSearchParams({ type: "latest", level: filters });
    setPage(1);
  }
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void =>{
    setFilters(op);
    setSearchParams({ type:activeTab, level: op });
    setIsOpen(false);
  };

  return <ForumLayout>
    <div 
      className="relative card flex-grow p-0 flex flex-col overflow-hidden"
      onMouseEnter={() => setPaginationVisible(true)}
      onMouseLeave={() => setPaginationVisible(false)}
    >
      <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <h2 className="hidden md:block text-lg font-semibold">Forum Listing</h2>
          <div className="btn-group">
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'featured' ? 'active' : ''}`} onClick={() => featuredlist()}>Featured</button>
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'latest' ? 'active' : ''}`} onClick={() => lastestlist()}>Latest</button>
          </div>
        </div>
      <div ref={wrapperRef} className="relative inline-block text-left">
        <button
        className="flex rounded-full items-center bg-primary/20 text-primary px-3 py-2 hover:bg-primary/30 text-xs md:text-base"
        onClick={toggleDropdown}>
        <span className="text-primary/30 mr-2">Show</span> <span>{filters}</span>
        <AiFillCaretDown className="text-primary/30 ml-1" /></button>
        {isOpen && (
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-36 text-white overflow-hidden rounded-sm pb-2 z-10 text-sm bg-neutral-800 shadow-lg">
          {options.map((op) => (
            <button
              key={op}
              className={`block w-full px-4 py-2.5 text-left hover:text-black hover:bg-primary/50 ${filters == op ? 'bg-primary/50 text-black' : ''}`}
              onClick={() => handleSelect(op)}>
              {op}
            </button>
              ))}
          </div>
        )}
        </div>
      </div>
  <div 
    className="h-full flex flex-col"
    >
  {/* Scrollable content */}
  <div
    className={`flex-1 overflow-auto p-2 sm:p-4 pb-24 flex flex-col gap-4 sm:gap-5 ${isLoading? "overflow-hidden loading" : "overflow-auto"  }`}
    onClick={() => setIsOpen(false)}
  >
    {isLoading || !callList.length ? (
      <SkeletonList />
    ) : (
      callList.map((item) => <CallRow call={item} key={item.id} />)
    )}
  </div>

</div>
  {/* Fixed pagination bar inside the map div */}
 {showPagination && (
  <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50'
    style={{ 
      transition: 'bottom 0.15s ease-in-out',
      bottom: isPaginationVisible ? '0.5rem' : '-3rem',
    }}
  >
    <div className="flex items-center gap-1.5 bg-darker/80 text-white px-3 py-2 rounded-full shadow-lg text-base">

      {/* First */}
      <button
        onClick={() => { setSearchParams({ type: activeTab, level: filters, page: "1" }); setPage(1); }}
        disabled={page === 1}
        className="w-7 h-7 leading-none  flex items-center justify-center rounded-full hover:bg-primary hover:text-black transition disabled:text-gray-500 disabled:bg-transparent"
      >
        <span className=""><FaAnglesLeft /></span>
      </button>

      {/* Prev */}
      <button
                onClick={() => { setPage((p) => Math.max(p - 1, 1));setSearchParams({ type: activeTab, level: filters, page: String(Number(page-1)) }); }}
        disabled={page === 1}
        className="w-7 h-7 leading-none  flex items-center justify-center rounded-full hover:bg-primary hover:text-black transition disabled:text-gray-500 disabled:bg-transparent"
      >
        <span className=""><FaAngleLeft /></span>
      </button>

      {/* Page Input */}
      <div className="flex items-center gap-2 px-1">
        <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            const val = Number(inputValue);
            if (!isNaN(val) && val >= 1 && val <= totalPages) {
              setPage(val);
            } else {
              setInputValue(String(page));
            }
          }
        }}
        className="w-8 h-7 bg-dark/50 text-white text-base text-center rounded-md focus:outline-none border-[1px] border-gray-300"
        placeholder="1"
      />
        <span>/</span>
        <span className="">{totalPages}</span>
      </div>

      {/* Next */}
      <button
                onClick={() => { setPage((p) => Math.min(p + 1, totalPages));setSearchParams({ type: activeTab, level: filters, page: String(Number(page+1)) });  }}
        disabled={page === totalPages}
        className="w-7 h-7 leading-none  flex items-center justify-center rounded-full hover:bg-primary hover:text-black transition disabled:text-gray-500 disabled:bg-transparent"
      >
        <span className=""><FaAngleRight /></span>
      </button>

      {/* Last */}
      <button
                onClick={() => { setPage(totalPages); setSearchParams({ type: activeTab, level: filters, page: String(totalPages) }); }}
        disabled={page === totalPages}
        className="w-7 h-7 leading-none flex items-center justify-center rounded-full hover:bg-primary hover:text-black transition disabled:text-gray-500 disabled:bg-transparent"
      >
        <span className=""><FaAnglesRight /></span>
      </button>
    </div>
  </div>
)}
      
    </div>
  </ForumLayout>
}

export default ForumList;