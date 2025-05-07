const ForumCard = () => {
  return (<>
    <div className="bg-gray-50 items-start text-white pt-12 pl-4 pr-4 rounded space-y-6 h-[240px] mt-[42px]">

      <div className="flex gap-0 sm:gap-3">
        {
          Array(9).fill(0).map((value, index) => <span className={`badge-rank-${index+1} w-[24px] h-[24px]`}></span>)
        }
      </div> 
      <div className="space-y-3 sm:space-y-6">
        <h3 className="font-bold text-base sm:text-lg text-white">Login and become a caller!</h3>
        <p className="text-white/60 text-xs sm:text-base">Reach new levels become a top1! share your plays.</p>
      </div>
    </div>
  </>)
}

export default ForumCard;