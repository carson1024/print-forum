import LeaderboardBack from "assets/img/leaderboard.png";

const LeaderboardCard = () => {
  return (<>
    <div className="bg-gray-50 text-white rounded space-y-6 relative overflow-hidden">
      <img src={LeaderboardBack} />
      <div className="absolute left-0 bottom-0 space-y-4 p-8">
        <h3 className="font-bold text-lg text-black">Leaderboard</h3>
        <p className="text-black/60 leading-snug">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis odio rhoncus.</p>
      </div>
    </div>
  </>)
}

export default LeaderboardCard;