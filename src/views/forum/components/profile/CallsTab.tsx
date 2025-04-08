import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import { Link } from "react-router-dom";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../../../src/components/skeleton/forum";
import React, { useState } from "react";
import { formatNumber, formatShortAddress, formatTimestamp } from "../../../../utils/blockchain"
import { CallRow } from "../CallRow";

type Props = {
  myprofile: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    xp: string;
    rank: string;
    winrate: string;
    callcount: string;
    achievements: string;
    created_at: string;
  };
};
const CallsTab = ({ myprofile }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [prevcall, setPrevcall] = useState([]);
  const [activecall, setActivecall] = useState([]);
  const [state, setState] = useState(0);
  useEffect(() => {
    setIsLoading(true); 
     const scan = async () => {
      const { data, error } = await supabase
              .from("calls")
              .select("*, users(*)")
              .eq("user_id", myprofile.id)
              .order("updated_at", { ascending: false })
              .limit(20);
            if (error) {
              console.error("Error fetching calls:", error.message);
              return;
            }
            if(data) {
              const active = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() > 0));
              setPrevcall(active);
              const prev = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() <= 0));
              setActivecall(prev)
            }
  };
    scan(); 
     setIsLoading(false);
      // Subscribe to real-time changes in the "calls" table
       }, []);
 
  const buttonActive = () => {
    setState(1);
  }
  const buttonPrev = () => {
    setState(0);
  }

  return (<>
    <div className="p-4 sm:p-6 h-full flex flex-col gap-3">
      <div className='btn-group primary !hidden sm:!flex'>

        <button className={`btn btn-sm  ${state == 1 ? 'active' : ''}`} onClick={() => buttonActive()}>Active Calls</button>
        <button className={`btn btn-sm  ${state == 0 ? 'active' : ''}`} onClick={() => buttonPrev()}>Previous Calls</button>

      </div>
      <div className="flex-grow overflow-auto">
        <div className='flex flex-col gap-3'>

          {isLoading ? <SkeletonList /> :
            <>
              {state == 0 ? <>
                {
                  !activecall.length ?
                    <>
                      <SkeletonRow opacity={60} />
                      <SkeletonRow opacity={30} />
                    </> : activecall.map((item) => <CallRow call={item} key={item.id} />)
                }
              </>
                : <>
                  {
                    !prevcall.length ?
                      <>
                        <SkeletonRow opacity={60} />
                        <SkeletonRow opacity={30} />
                      </> : prevcall.map((item) => <CallRow call={item} key={item.id} />)
                  }
              
                </>}         
            </>           
          }

        
          

        
        </div>
      </div>
    </div>
  </>);
}

export default CallsTab;