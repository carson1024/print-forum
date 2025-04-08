import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../../../src/components/skeleton/forum";
import React, { useState } from "react";
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