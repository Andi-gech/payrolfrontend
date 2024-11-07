// eslint-disable-next-line react/prop-types
export default function HButtons({ icon, name }) {
  return (
    <div className="w-full flex flex-row items-center h-[50px] shadow-sm shadow-zinc-900 px-2 my-2">
      {icon}
      <p className="text-white mx-2">{name}</p>
    </div>
  );
}
