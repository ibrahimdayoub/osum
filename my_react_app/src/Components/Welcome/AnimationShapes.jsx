import { FaMoon, FaStar } from "react-icons/fa";

const AnimationShapes = () => {

  let dims = []

  for (let i = 0; i < 100; i = i + 6) {
    dims.push(Math.ceil(Math.random() * 600))
  }

  return (
    dims.map((dim, idx) => {
      return (
        idx % 2 === 0 ?
          <>
            <div style={{ position: "absolute", top: `${(dim % 600)}px`, left: `${(dims[idx - 1])}px` }}>
              <FaStar className="text-queen/[30%] dark:text-king/[30%] text-xs animate-pulse duration-300"/>
            </div>
            <div style={{ position: "absolute", top: `${(dims[idx - 1])}px`, right: `${(dim % 600)}px` }}>
              <FaStar className="text-queen/[30%] dark:text-king/[30%] text-xs animate-pulse duration-300"/>
            </div>

          </> :
          <>
            <div style={{ position: "absolute", top: `${(dim % 600)}px`, left: `${(dims[idx - 1])}px` }}>
              <FaMoon className="text-queen/[30%] dark:text-king/[30%] text-xs animate-pulse duration-300 delay-300"/>
            </div>
            <div style={{ position: "absolute", top: `${(dims[idx - 1])}px`, right: `${(dim % 600)}px` }}>
              <FaMoon className="text-queen/[30%] dark:text-king/[30%] text-xs animate-pulse duration-300 delay-300"/>
            </div>
          </>
      )
    })
  )
}
export default AnimationShapes