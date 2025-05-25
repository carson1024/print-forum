import Pause from 'assets/img/pause.png';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ForumLayout from "./layout"
import { supabase } from "lib/supabase";
import { SkeletonList } from "components/skeleton/forum";
import { CallRow } from "./components/CallRow";

const options = ["All Ranks", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"];

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
  // const [activeTab, setActiveTab] = useState<'featured' | 'latest'>(searchParams.get('type') as 'featured' | 'latest' || 'featured');
  const [isLoading, setIsLoading] = useState(true);
  const [callListFeatured, setCallListFeatured] = useState([]);
  const [callListLatest, setCallListLastest] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
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
  const [activeTab, setActiveTab] = useState('featured');
  useOutsideAlerter(wrapperRef, setIsOpen);
  useEffect(() => {
    setInputValue(String(page));
    setIsLoading(true);
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
      if (data) {
        if (filters == "All Ranks" || filters == null) {
          setCallListFeatured(data.filter(call => call.is_featured === true));
          setCallListLastest(data.filter(call => call.is_featured === false))
        }
        else {
          setCallListFeatured((data.filter(call => call.is_featured === true)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)));
          setCallListLastest((data.filter(call => call.is_featured === false)).filter(call => call.users.rank === parseInt(filters.slice(6, 8), 10)));
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

  }, [filters, page]);

  const handleMouseMove = () => {
  };
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void => {
    setFilters(op);
    setSearchParams({ level: op });
    setIsOpen(false);
  };

  return <ForumLayout>
    <div className="border-r border-gray-800">
      <div className="grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">

        <div className="flex border-b border-gray-800 flex items-center justify-between px-[18px]">
          <div className=" hidden lg:flex show_filter items-center text-[14px] font-semibold text-gray-500">
            <div ref={wrapperRef} className="relative inline-block text-left">
              <span className='hidden lg:block'>Showing</span>
              <button className="text-white whitespace-nowrap text-[14px] font-semibold ml-[8px]" onClick={toggleDropdown}>{filters}</button>
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
              )}</div>
          </div>
          <div className="flex lg:hidden gap-2 mb-4">
        <button
          className={`px-3 py-3 rounded-[6px] text-[10px] font-semibold ${
            activeTab === 'featured'
              ? 'bg-[#CAF24433] text-[#CAF244]'
              : 'bg-[#1C1B1F] text-[#76767E]'
          }`}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </button>

        <button
          className={`px-3 py-3 rounded-[6px] text-[10px] font-semibold ${
            activeTab === 'latest'
              ? 'bg-[#CAF24433] text-[#CAF244]'
              : 'bg-[#1C1B1F] text-[#76767E]'
          }`}
          onClick={() => setActiveTab('latest')}
        >
          Latest
        </button>
      </div>

          <div className="flex  gap-2 items-center">
            <div className="flex lg:hidden show_filter items-center text-[14px] font-semibold text-gray-500">
              <div ref={wrapperRef} className="relative inline-block text-left">
                <span className='hidden lg:block'>Showing</span>
                <button className="text-white whitespace-nowrap text-[10px] font-semibold ml-[8px]" onClick={toggleDropdown}>{filters}</button>
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
                )}</div>
            </div>

            <div className=" flex text-[10px] lg:text-[14px] font-semibold text-gray-500">
              <div className=" hidden lg:flex items-center justify-center">
                <span>Feed is <span className="text-white whitespace-nowrap">Live</span></span>
              </div>
              <button className="ml-[20px] pause_btn flex items-center justify-center mainhover">
                <img src={Pause} className="w-[24px] h-[24px]" />
                <button>Pause</button>
              </button>
            </div>
          </div>

        </div>
        <div
        className="hidden lg:grid h-screen"
        style={{ gridTemplateColumns: 'calc((100vw - 501px) / 2) 1fr' }}
      >
        {/* Featured column */}
        <div className="border-r border-gray-800 flex flex-col h-screen">
          <div className="grid grid-rows-[50px_1fr] border-gray-800">
            <div className="border-b items-center flex">
              <div className="m-[18px] text-[14px] font-semibold text-white">Feature</div>
            </div>
            <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
              <div
                className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}
                onClick={() => setIsOpen(false)}
              >
                {isLoading || !callListFeatured.length ? (
                  <div className='p-2 sm:p-4 pb-24'><SkeletonList /></div>
                ) : (
                  callListFeatured.map((item) => <CallRow call={item} key={item.id} />)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Latest column */}
        <div className="border-gray-800 h-screen flex flex-col">
          <div className="grid grid-rows-[50px_1fr] border-gray-800">
            <div className="border-b items-center flex">
              <div className="m-[18px] text-[14px] font-semibold text-white">Latest</div>
            </div>
            <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
              <div
                className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}
                onClick={() => setIsOpen(false)}
              >
                {isLoading || !callListLatest.length ? (
                  <div className='p-2 sm:p-4 pb-24'><SkeletonList /></div>
                ) : (
                  callListLatest.map((item) => <CallRow call={item} key={item.id} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: show only active tab */}
      <div className="lg:hidden">
        {activeTab === 'featured' && (
          <div className="flex flex-col">
            <div className="m-[18px] text-[14px] font-semibold text-white">Feature</div>
            <div className="overflow-y-auto h-[calc(100vh-150px)]">
              {isLoading || !callListFeatured.length ? (
                <div className='p-2 sm:p-4 pb-24'><SkeletonList /></div>
              ) : (
                callListFeatured.map((item) => <CallRow call={item} key={item.id} />)
              )}
            </div>
          </div>
        )}

        {activeTab === 'latest' && (
          <div className="flex flex-col">
            <div className="m-[18px] text-[14px] font-semibold text-white">Latest</div>
            <div className="overflow-y-auto h-[calc(100vh-150px)]">
              {isLoading || !callListLatest.length ? (
                <div className='p-2 sm:p-4 pb-24'><SkeletonList /></div>
              ) : (
                callListLatest.map((item) => <CallRow call={item} key={item.id} />)
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  </ ForumLayout>
}
export default ForumList;