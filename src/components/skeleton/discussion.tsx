export const SkeletonDiscussionRow = ({
  opacity
}: {
  opacity: number;
}) => (
  <>
    <div className="flex gap-4" style={{ opacity: opacity / 100 }}>
      <div>
        <div className="w-8 h-8 sm:w-[50px] sm:h-[50px] bg-black circle-item skeleton">
        </div>
      </div>
      <div className="space-y-1 flex-grow">
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-600 skeleton w-36 h-5 rounded"></div>
          <div className="circle-item w-6 h-6 sm:w-7 sm:h-7 bg-red-300 text-black text-sm font-bold skeleton"></div>
        </div>
        <div className="space-y-1">
          <div className="w-4/4 h-4 rounded skeleton"></div>
          <div className="w-1/4 h-4 rounded skeleton"></div>
        </div>
      </div>
    </div>
    <div className="border-b-[1px] border-gray-100" style={{ opacity: opacity / 100 }}></div>
  </>
);

export const SkeletonDiscussionList = () => (
    <>
        <SkeletonDiscussionRow opacity={90} />
        <SkeletonDiscussionRow opacity={60} />
        <SkeletonDiscussionRow opacity={30} />
        <SkeletonDiscussionRow opacity={10} />
    </>
);