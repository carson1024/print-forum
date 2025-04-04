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



const ForumList = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'latest'>('latest');
  const [filter, setFilter] = useState("All Ranks");
  const [isLoading, setIsLoading] = useState(true);
  const [callList, setCallList] = useState([]);
  const options = ["All Ranks", "Level 1", "Level 2", "Level 3","Level 4","Level 5","Level 6","Level 7","Level 8","Level 9","Level 10"];
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(options[0]);
  useEffect(() => {
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
const handleSelect = (op: string): void=> {
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
      <div className="relative inline-block text-left">
      <button
       className="flex rounded-full items-center bg-primary/20 text-primary px-3 py-2 hover:bg-primary/30 text-xs md:text-base"
       onClick={toggleDropdown}>
       <span className="text-primary/30 mr-2">Show</span> <span>{filters}</span>
       <AiFillCaretDown className="text-primary/30 ml-1" /></button>
     {isOpen && (
      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-primary/99 bg-transparent text-white bg-dark-40 border-2 border-black rounded-md  text-mg shadow-lg z-10 text-center font-bold ">
        {options.map((op) => (
          <button
            key={op}
            className="block w-full px-4 py-2 text-left bg-neutral-800 text-gray-250 hover:bg-gray-100"
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