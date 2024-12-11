"use client";

import dynamic from "next/dynamic";

const Client = dynamic(() => import("./component/Client"), {
  ssr: false, // This disables SSR for the Home component
});
const Home = () => {
  return (
    <div className="w-full h-full">
      <Client />
    </div>
  );
};

export default Home;
