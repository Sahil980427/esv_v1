import React from 'react';import "./App.css";
import AppMain from "./AppMain";
// import Preloader from "./mainpages/Preloader";

export default function App() {
//  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const handleLoad = () => {
//       // 1.5s delay for a premium feel
//       setTimeout(() => {
//         setLoading(false);
//       }, 1500);
//     };

//     if (document.readyState === 'complete') {
//       handleLoad();
//     } else {
//       window.addEventListener('load', handleLoad);
//       return () => window.removeEventListener('load', handleLoad);
//     }
//   }, []);

  return (
    <>
{/* //       {loading ? ( */}
{/* //         <Preloader /> */}
{/* //       ) : ( */}
{/* //         <div className="fade-in"> */}
          <AppMain />
      {/* //   </div> */}
      {/* // )} */}
    </>
  );
}