// React
import { useState } from "react";

// Componentes
import NavBar from "./NavBar";
import { Link, NavLink, useLocation } from "react-router-dom";

// BiBliotecas
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

// Assets
import SloganPlayCell from "./../../assets/playcell.png";

// Utils
import { ColorPage } from "../../utils/ColorPage";

const SideBar = () => {
  const [toggleMenuClosed, setToggleMenuClosed] = useState(false);

  const { getColorForRoute } = ColorPage();

  return (
    <div className="bg-gray-100">
      <div
        className={
          toggleMenuClosed
            ? "transition-all ease-in-out duration-300 md:static xl:fixed medium-screen:fixed fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 md:z-50 z-50"
            : ""
        }
      >
        <aside
          className={
            toggleMenuClosed
              ? `small-screen:w-60 ${getColorForRoute()} fixed inset-0 z-50 my-2 ml-2 h-[calc(100vh-26px)] w-80 rounded-xl transition-transform duration-300 xl:translate-x-0 `
              : `${getColorForRoute()} -translate-x-80 fixed inset-0 z-50 my-2 ml-2 h-[calc(100vh-26px)] lower-resolution:w-60 w-80 rounded-xl transition-transform duration-300 xl:translate-x-0 `
          }
        >
          <div className="relative border-b border-white/20">
            <div className="flex items-center justify-center mt-10">
              <motion.img
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-[68px] pb-2"
                src={SloganPlayCell}
              />
            </div>
            <button
              onClick={() => setToggleMenuClosed(!toggleMenuClosed)}
              className="middle mr-3 none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-black/50 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
              type="button"
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
          <div className="m-4">
            <ul className="mb-4 flex flex-col gap-1">
              <li>
                <div>
                  <motion.div
                    whileHover={{
                      x: [-4, 4, -4, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <NavLink
                      to={"/"}
                      className={({ isActive }) =>
                        isActive
                          ? "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                          : "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                      }
                      type="button"
                    >
                      <FontAwesomeIcon icon={faFile} className="w-5 h-5" />
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Relatório de DAVs
                      </p>
                    </NavLink>
                  </motion.div>
                </div>
              </li>

              <li>
                <div>
                  <motion.div
                    whileHover={{
                      x: [-4, 4, -4, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <NavLink
                      to={"/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                          : "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                      }
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                      </svg>

                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        dashboard
                      </p>
                    </NavLink>
                  </motion.div>
                </div>
              </li>

              <li></li>
            </ul>
            <ul className="mb-4 flex flex-col gap-1 border-t border-white/20 medium-screen:mt-0 mt-20">
              <li className="mx-3.5 mt-4 mb-2">
                <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-90">
                  autenticação
                </p>
              </li>

              <div className="flex items-center gap-4 py-2 px-2 w-full flex ">
                <div className="rounded-full border-2 object-cover p-2">
                  <svg
                    width="26px"
                    height="26px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#fff"
                  >
                    <path
                      d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="flex w-50 flex-col">
                  <h6 className="block antialiased tracking-normal font-sans text-base font-bold leading-relaxed text-white text-xm pd-2">
                    Admin
                  </h6>
                  <p className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white text-xs">
                    admin@gmail.com
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{
                  x: [-4, 4, -4, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <a aria-current="page" className="" href="#">
                  <button
                    className="transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                    type="button"
                  >
                    <svg
                      width="22px"
                      height="22px"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="#fff"
                    >
                      <path
                        d="M12 12H19M19 12L16 15M19 12L16 9"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      Sair
                    </p>
                  </button>
                </a>
              </motion.div>
            </ul>
          </div>
        </aside>
      </div>
      <NavBar
        toggleMenuClosed={toggleMenuClosed}
        setToggleMenuClosed={() => setToggleMenuClosed(!toggleMenuClosed)}
      />
    </div>
  );
};

export default SideBar;
