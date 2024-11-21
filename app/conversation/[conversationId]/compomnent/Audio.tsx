import { BsSoundwave } from "react-icons/bs";

const Audio = () => {
  return (
    <>
      <div className="w-full relative">
        <div className="absolute top-1 left-2 flex items-center">
          <BsSoundwave className=" text-sky-600 animate-pulse" size={20} />
          <BsSoundwave className=" text-sky-600 animate-pulse" size={30} />
          <BsSoundwave className=" text-sky-600 animate-pulse" size={24} />
          <BsSoundwave className=" text-sky-600 animate-pulse" size={32} />
        </div>
        <input className="text-black font-light py-2 px-4  bg-neutral-100 w-full rounded-full focus:outline-none" />
      </div>
    </>
  );
};

export default Audio;
