import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "lib/supabase";
const Icons = () => {
  const { isLogin,session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const route = useLocation();
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   if (!session) { return;}
     setIsLoading(true)
     const scan = async () => {
     const { data, error } = await supabase
              .from("users")
              .select("*")
              .match({ "id": session.user.id });
           if (error) {
              console.error("Fetch failed:", error);
              return; 
               }
           if (data.length > 0) {
              setProfile(data)
              setIsLoading(false)
              } else {
            }};
     scan();   
   const channel = supabase
      .channel("my_users")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users" }, scan)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);};
    }, [session]);
  
    return (
        <>
       {isLoading?<div className='ml-auto flex px-3 py-2 gap-3 bg-gray-50 rounded-full items-center' >
        <button><img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' /></button>
        <button><img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' /></button>
        <button><img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' /></button>
            </div> :
        <div className='ml-auto flex px-3 py-2 gap-3 bg-gray-50 rounded-full items-center' >
        <button><a  href={`https://x.com/${profile[0].xaddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' /></a></button>
        <button><a  href={`https://t.me/${profile[0].taddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' /></a></button>
        <button><a  href={`https://explorer.solana.com/address/${profile[0].saddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' /></a></button>
            </div> }
      </>
       )
      }  

export default Icons;