import dynamic from "next/dynamic";
const Basics = dynamic(() => import("./component/Videocall"), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="w-full h-full">
      <Basics />
    </div>
  );
};

export default Home;
