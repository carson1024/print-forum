import React, { act, useEffect, useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import { Link } from "react-router-dom";
import { supabase } from "lib/supabase";
import { formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain";
import { SkeletonList } from "components/skeleton/forum";
import { CallRow } from "./components/CallRow";
import { checkPrice } from "components/cron/netlify";

const options = ["All Ranks", "Level 1", "Level 2", "Level 3","Level 4","Level 5","Level 6","Level 7","Level 8","Level 9","Level 10"];

function useOutsideAlerter(ref: any, setX: any): void {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    // function handleClickOutside(event: React.MouseEvent<HTMLElement>) {
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
  const [activeTab, setActiveTab] = useState<'featured' | 'latest'>('latest');
  const [filter, setFilter] = useState("All Ranks");
  const [isLoading, setIsLoading] = useState(true);
  const [callList, setCallList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(options[0]);
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setIsOpen);

  useEffect(() => {
    if (localStorage.getItem("levelSelected") == null) {
      localStorage.setItem('levelSelected', 'All Ranks');
    }
    else { setFilters(localStorage.getItem("levelSelected")) }
    if (localStorage.getItem("tag") == null) { 
      localStorage.setItem('tag', '2');
      setActiveTab('latest');
    }
    else {
      if (localStorage.getItem("tag") == "1") { setActiveTab('featured'); }
      else{setActiveTab('latest');}
      }
   setIsLoading(true);
   const fetchCalls = async () => {
   const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
     }
     if (localStorage.getItem("tag")==null || localStorage.getItem("tag") == "1") {
       if (localStorage.getItem("levelSelected") == "All Ranks") {
         setCallList(data.filter(call => call.is_featured === true));
       }
       else {
         setCallList((data.filter(call => call.is_featured === true)).filter(call => call.users.rank === parseInt(localStorage.getItem("levelSelected").slice(6, 8), 10)));
       }
     }
     else if (localStorage.getItem("tag") == "2") {
       if (localStorage.getItem("levelSelected") == "All Ranks" || localStorage.getItem("levelSelected") ==null) {
         setCallList(data.filter(call => call.is_featured === false));
       }
       else {
         setCallList((data.filter(call => call.is_featured === false)).filter(call => call.users.rank === parseInt(localStorage.getItem("levelSelected").slice(6, 8), 10)));
       }
     }
      
      setIsLoading(false);
    }
    fetchCalls();   
   const interval = setInterval(() => {
    fetchCalls();   
    checkPrice();
    }, 20000);
    
    const subscription = supabase
      .channel("my_calls")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, fetchCalls)
      .subscribe();
    return () => {
      clearInterval(interval) 
      subscription.unsubscribe();
    };
      
    
        
  }, []);

  const featuredlist = () => {
    localStorage.setItem("tag", "1");
   setActiveTab('featured')
   setFilters(options[0])
   setIsLoading(true);
   const featuredCalls = async () => {
   const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .eq("is_featured", true)
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
      setCallList(data);
      setIsLoading(false);
    }
    featuredCalls();   
 }
  
  const lastestlist = () => {
   localStorage.setItem("tag", "2");
   setActiveTab('latest')
      setFilters(options[0])
   setIsLoading(true);
   const fetchCalls = async () => {
   const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .eq("is_featured", false)
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
      setCallList(data);
      setIsLoading(false);
    }
    fetchCalls();     
 }
  
const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void => {
  localStorage.setItem("levelSelected", op);
  setFilters(op);
  setIsOpen(false);
  if (activeTab == "featured") { 
    if (op == "All Ranks") {
      setIsLoading(true);
      const levelCalls = async () => {
        const { data, error } = await supabase
          .from("calls")
          .select("*, users(*)")
          .eq("is_featured", true)
          .order("updated_at", { ascending: false })
          .limit(20);
        if (error) {
          console.error("Error fetching calls:", error.message);
          return;
        }
        setCallList(data);
        setIsLoading(false);
      }
      levelCalls();
     }  
    if (op !== "All Ranks") {
      var level = parseInt(op.slice(6, 8), 10)
      setIsLoading(true);
      const levelCalls = async () => {
        const { data, error } = await supabase
          .from("calls")
          .select("*, users(*)")
          .eq("is_featured", true)
          .order("updated_at", { ascending: false })
          .limit(20);
        if (error) {
          console.error("Error fetching calls:", error.message);
          return;
        }
        setCallList(data.filter(call => call.users.rank === level));
        setIsLoading(false);
      }
      levelCalls();
    }  
  }
  if (activeTab == "latest") { 
    if (op == "All Ranks") {
      setIsLoading(true);
      const levelCalls = async () => {
        const { data, error } = await supabase
          .from("calls")
          .select("*, users(*)")
          .eq("is_featured", false)
          .order("updated_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Error fetching calls:", error.message);
          return;
        }
        setCallList(data);
        setIsLoading(false);
      }
      levelCalls();
    }  
    if (op !== "All Ranks") {
      var level = parseInt(op.slice(6, 8), 10)
      setIsLoading(true);
      const levelCalls = async () => {
        const { data, error } = await supabase
          .from("calls")
          .select("*, users(*)")
          .eq("is_featured", false)
          .order("updated_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Error fetching calls:", error.message);
          return;
        }
        setCallList(data.filter(call => call.users.rank === level));
        setIsLoading(false);
      }
      levelCalls();
    }  
  }
};

  return <ForumLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <h2 className="hidden md:block text-lg font-semibold">Forum Listing</h2>
          <div className="btn-group">
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'featured' ? 'active' : ''}`} onClick={() => featuredlist()}>Featured</button>
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'latest' ? 'active' : ''}`} onClick={() => lastestlist()}>Latest</button>
          </div>
        </div>
        {/* <button className="flex rounded-full items-center bg-primary/20 text-primary px-3 py-2 hover:bg-primary/30 text-xs md:text-base "  >
        <span className="text-primary/30 mr-2 ">Show</span> <span>{filter}</span> <AiFillCaretDown className="text-primary/30 ml-1" />
        </button> */}
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
 
      <div className={`p-4 sm:p-6 flex flex-col gap-5 flex-grow ${isLoading ? 'overflow-hidden loading' : 'overflow-auto'}`} onClick={()=>setIsOpen(false)}>   
        { isLoading || !callList.length ?
          <SkeletonList />
         : 
          callList.map((item) => <CallRow call={item} key={item.id} />)
        }
      </div>
    </div>
  </ForumLayout>
}

export default ForumList;