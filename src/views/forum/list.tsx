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

const ForumList = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'latest'>('featured');
  const [filter, setFilter] = useState("All Ranks");
  const [isLoading, setIsLoading] = useState(true);
  const [callList, setCallList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .order("updated_at", { ascending: false })
        .limit(20);
  
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
  
      console.log("Calls with User Emails:", data);
      setCallList(data);
  
      setIsLoading(false);
    }

    fetchCalls();

    // Subscribe to real-time changes in the "calls" table
    const subscription = supabase
      .channel("calls")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, fetchCalls)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };

  }, []);

  return <ForumLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <h2 className="hidden md:block text-lg font-semibold">Forum Listing</h2>
          <div className="btn-group">
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'featured' ? 'active' : ''}`} onClick={() => setActiveTab('featured')}>Featured</button>
            <button className={`btn btn-sm md:btn-lg ${activeTab == 'latest' ? 'active' : ''}`} onClick={() => setActiveTab('latest')}>Latest</button>
          </div>
        </div>
        <button className="flex rounded-full items-center bg-primary/20 text-primary px-3 py-2 hover:bg-primary/30 text-xs md:text-base">
          <span className="text-primary/30 mr-2">Show</span> <span>{filter}</span> <AiFillCaretDown className="text-primary/30 ml-1" />
        </button>
      </div>
 
      <div className={`p-4 sm:p-6 flex flex-col gap-5 flex-grow ${isLoading ? 'overflow-hidden loading' : 'overflow-auto'}`}>
        
        { isLoading ?
          <SkeletonList />
         : !callList.length ? 
          <div>No Data Available</div> : 
          callList.map((item) => <CallRow call={item} key={item.id} />)
        }
      </div>
    </div>
  </ForumLayout>
}

export default ForumList;