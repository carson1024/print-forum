import React, { useEffect, useState,useRef } from "react";
import Modal from "."
import IconUpload from 'assets/img/icons/upload.svg';
import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "lib/supabase";
import { showToastr } from "../../components/toastr";
import { SkeletonList, SkeletonRow } from "../../components/skeleton/forum";
import IconUser from 'assets/img/icons/user.svg';

const EditProfileModal = ({
    isOpen,
    onOk,
    onCancel,
    onChange,
  }: Readonly<{
    isOpen: boolean,
    onOk: () => void
    onCancel: () => void
    onChange: (xaddress:string,taddress:string,saddress:string,bio:string,avatar:string) => void
  }>) => {
  const { isLogin, session } = useAuth();
  const [xaddress, setXaddress] = useState('');  
  const [taddress, setTaddress] = useState('');  
  const [saddress, setSaddress] = useState('');  
  const [bio, setBio] = useState('');  
  const [profile, setProfile] = useState([]);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isLogin) {
      if (!session.user.id) { return; }
      const info = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id);
        if (error) {
          console.error("Fetch failed:", error);
          return;
        }
        if (data.length > 0) {
          setPreview(data[0].avatar);
          setXaddress(data[0].xaddress);
          setTaddress(data[0].taddress);
          setSaddress(data[0].saddress);
          setBio(data[0].bio);
          setProfile(data);
          setIsLoading(false);
        } else {
        }
      };
      info();
     }
   }, [session]);
  
  const onsaveInfo = async () => { 
     const { error: updateError } = await supabase
          .from("users")
          .update({ xaddress: xaddress,taddress:taddress,saddress:saddress,avatar:preview, bio: bio })
          .eq("id", session.user.id);
        if (updateError) {
          console.error("Update failed:", updateError);
        } else {
          showToastr("Your information is changed", "success");
          onChange(xaddress, taddress, saddress, bio, preview);
          onOk();
        }
  }
  return <Modal isOpen={isOpen} onClose={onCancel} extraClass="w-[620px]">

    <div className="space-y-6 loading">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {isLoading ? <img src={IconUser} className="w-[12px] h-[12px] sm:w-[82px] sm:h-[82px] circle" /> : <>
            {preview ? (
              <img src={preview} alt="Avatar" className="w-[42px] h-[42px] sm:w-[82px] sm:h-[82px] circle" />
            ) : profile[0].avatar !== null ? (<img src={profile[0].avatar} className="w-[42px] h-[42px] sm:w-[82px] sm:h-[82px] circle" />) : (<img src={IconUser} className="w-[12px] h-[12px] sm:w-[82px] sm:h-[82px] circle" />)
                
            }</>}
          <div className="space-y-2">
            {isLoading ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> : <h2 className="text-base sm:text-lg font-bold">{profile[0].name}</h2>}
            {isLoading?<div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div>: <button className=" sm:flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-full" onClick={handleButtonClick}>
              <img src={IconUpload} className="w-5 h-5" /> Upload new picture
            </button>}
            
             <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e)=>handleFileChange(e)}
              />
          </div>
        </div>
      </div>
    <div className="border-b-[1px] border-gray-100"></div>
      {/* Social Links */}
      <div className="space-y-5">
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconTwitter} className="w-5 h-5 opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">x.com/</span>
          {isLoading ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> :
            <input
              type="text"
              placeholder="address"
              defaultValue={xaddress}
              onChange={(e) => setXaddress(e.target.value)}
              className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
            />}
        </div>
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconTelegram} className="w-[28px] h-[28px] opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">t.com/</span>
          {isLoading ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> :
            <input
              type="text"
              placeholder="address"
              defaultValue={taddress}
              onChange={(e) => setTaddress(e.target.value)}
              className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
            />}
        </div>
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconSolana} className="w-6 h-6 opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">address:</span>
          {isLoading ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> :
            <input
              type="text"
              placeholder="address"
              defaultValue={saddress}
              onChange={(e) => setSaddress(e.target.value)}
              className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
            />}
        </div>
        <div className="flex items-start bg-gray-50 rounded-[20px] px-5 py-2.5">
          <span className="text-gray-600 mr-2">Bio</span>
          {isLoading ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> :
            <textarea
              placeholder="Write a short bio..."
              defaultValue={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 resize-none text-xs sm:text-sm !leading-[135%]"
            ></textarea>}
        </div>
      </div>
      {/* Save Button */}
      <button className="w-full btn py-3 text-sm sm:text-base" onClick={onsaveInfo}>Save</button>
    </div>
  </Modal>
 }
export default EditProfileModal;