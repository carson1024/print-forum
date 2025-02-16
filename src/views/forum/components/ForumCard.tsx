const ForumCard = () => {
  return (<>
    <div className="bg-gray-50 text-white p-8 rounded space-y-6">
      <div className="flex gap-3">
        {
          Array(9).fill(0).map((value, index) => <span className={`badge-rank-${index+1}`}></span>)
        }
      </div>
      <h3 className="font-bold text-lg text-white">Login and become a caller!</h3>
      <p className="text-white/60">Reach new levels become a top1! share your plays.</p>
    </div>
  </>)
}

export default ForumCard;