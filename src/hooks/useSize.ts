import { useEffect, useState } from "react";

const useSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const onWindowSizeChanged = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", onWindowSizeChanged);

    return () => window.removeEventListener("resize", onWindowSizeChanged);
  });

  return size;
};

export default useSize;
