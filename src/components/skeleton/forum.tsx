export const SkeletonRow = ({ opacity }: { opacity: number }) => (
  <div
    className={`bg-gray-50 p-1.5 pr-3 circle sm:rounded-[40px] flex flex-col gap-2 sm:gap-3`}
    style={{ opacity: opacity / 100 }}
  >
    <div className="flex items-center gap-2.5">
      <div className="flex flex-wrap grow">
        <div className="flex grow gap-2 sm:gap-3 items-center">
          <div className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle skeleton" />
          <div className="grow space-y-1 sm:space-y-1.5">
            <div className="skeleton w-3/4 h-4 rounded"></div>
            <div className="skeleton w-1/4 h-5 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonList = () => (
  <>
    <SkeletonRow opacity={90} />
    <SkeletonRow opacity={60} />
    <SkeletonRow opacity={30} />
    <SkeletonRow opacity={5} />
  </>
);
