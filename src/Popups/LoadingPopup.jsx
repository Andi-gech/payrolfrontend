import { Bars } from "react-loader-spinner";

export default function LoadingPopup() {
  return (
    <div className=" fixed z-50 w-[85%]  backdrop-blur-sm  h-screen flex items-center justify-center overflow-hidden  bg-opacity-5">
      <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center">
        <Bars
          height="80"
          width="80"
          color="blue"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  );
}
