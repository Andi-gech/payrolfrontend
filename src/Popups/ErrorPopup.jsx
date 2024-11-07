export default function ErrorPopup() {
  return (
    <div className="fixed z-50 w-[85%] h-screen flex justify-end overflow-hidden bg-opacity-5">
      <div className="w-[300px] h-[100px] bg-red-400 rounded-md p-4 flex flex-col animate-slide-in">
        <p className="text-[24px] text-white font-bold">Error</p>
        <p className="text-[14px] text-white font-normal">
          An error occurred while fetching data
        </p>
      </div>
    </div>
  );
}
