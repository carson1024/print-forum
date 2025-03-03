export const SkeletonMyCallsRow = ({
  opacity
}: {
  opacity: number;
}) => (
  <div className={`rounded-full border border-black/15 flex gap-1 items-center p-1 pr-3`} style={{ opacity: opacity / 100 }}>
    <div className="w-8 h-8 sm:w-[40px] sm:h-[40px] circle skeleton dark"></div>
    <div className="skeleton w-3/4 h-4 rounded skeleton dark"></div>
  </div>
);

export const SkeletonMyCallsList = () => (
    <>
        <SkeletonMyCallsRow opacity={80} />
        <SkeletonMyCallsRow opacity={40} />
    </>
);