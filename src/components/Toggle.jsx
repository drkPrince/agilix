import { useState } from "react";

function Toggle({dbStatus,emitToggle}) {

  const [toggle, setToggle] = useState(dbStatus);
  const toggleClass = " bg-green-600 transform  translate-x-6";
  return (
    <>
      <div
          className="md:w-14 md:h-7 w-12 h-6 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer"
          onClick={() => {
            emitToggle(!toggle)
            setToggle(!toggle);
          }}
        >
          {/* Toggle */}
          <div
            className={
              "bg-black md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
              (toggle ? null : toggleClass)
            }
          ></div>
        </div>
    </>
  );
}

export default Toggle;
