// React
import { useState } from "react";

// Componentes
import NavBar from "./NavBar";
import { Link, NavLink } from "react-router-dom";

// BiBliotecas
import { motion } from "framer-motion"

// Assets
import SloganPlayCell from "./../assets/playcell.png"

const SideBar = () => {
  const [toggleMenuClosed, setToggleMenuClosed] = useState(false);

  return (
    <div className="bg-gray-100">
      <div className={toggleMenuClosed ? "transition-all ease-in-out duration-300 md:static xl:fixed medium-screen:fixed fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 md:z-50 z-50" : ""}>
        <aside
          className={
            toggleMenuClosed
              ? "small-screen:w-60 bg-gradient-to-br from-red-400 to-red-800 fixed inset-0 z-50 my-2 ml-2 h-[calc(100vh-26px)] w-80 rounded-xl transition-transform duration-300 xl:translate-x-0 "
              : "bg-gradient-to-br from-red-700 to-red-400 -translate-x-80 fixed inset-0 z-50 my-2 ml-2 h-[calc(100vh-26px)] lower-resolution:w-60 w-80 rounded-xl transition-transform duration-300 xl:translate-x-0 "
          }>
          <div className="relative border-b border-white/20">
            <div className="flex items-center justify-center mt-10">
              <motion.img initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-[86px]" src={SloganPlayCell} />
            </div>
            <button
              onClick={() => setToggleMenuClosed(!toggleMenuClosed)}
              className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-black/50 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
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
                    whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
                  >
                    <NavLink
                      to={"/"}
                      className={({ isActive }) => (
                        isActive ?
                          "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-r from-black to-red-600 text-white shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                          :
                          "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105")
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

              <li>
                <div className="">
                  <motion.div
                    whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
                  >
                    <NavLink
                      to={"/stock"}
                      className={({ isActive }) => (
                        isActive ?
                          "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-r from-black to-red-600 text-white shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                          :
                          "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105")
                      }
                      type="button"
                    >
                      <div className="flex w-full ">
                        <svg
                          width="24px"
                          height="24px"
                          stroke-width="1.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          color="#fff"
                        >
                          <path
                            d="M9.99998 15L9.99999 19C10 20.1046 9.10457 21 7.99999 21H4C2.89543 21 2 20.1046 2 19V15C2 13.8954 2.89543 13 4 13H7.99998C9.10455 13 9.99998 13.8954 9.99998 15Z"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M16 4.99999L16 8.99999C16 10.1046 15.1046 11 14 11H10C8.89543 11 8 10.1046 8 9V5C8 3.89543 8.89543 3 10 3H14C15.1045 3 16 3.89543 16 4.99999Z"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M22 15L22 19C22 20.1046 21.1046 21 20 21H16C14.8954 21 14 20.1046 14 19V15C14 13.8954 14.8954 13 16 13H20C21.1045 13 22 13.8954 22 15Z"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M6 16V13"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M12 6V3"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M18 16V13"
                            stroke="#fff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                        <p className="pl-3 block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                          Estoque
                        </p >
                      </div>

                      {/* <div>
                      <svg
                        width="24px"
                        height="24px"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#fff"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="#fff"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div> */}
                    </NavLink>
                  </motion.div>
                </div>
              </li>
              <li>
                <motion.div
                  whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
                >
                  <a className="" href="#">
                    <button

                      className="transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="w-5 h-5 text-inherit"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        tables
                      </p>
                    </button>
                  </a>
                </motion.div>
              </li>

              <li>
                <motion.div
                  whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
                >
                  <a className="" href="#">
                    <button
                      className="transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                      type="button"
                    >
                      <svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                        <path d="M4 21.4V2.6C4 2.26863 4.26863 2 4.6 2H16.2515C16.4106 2 16.5632 2.06321 16.6757 2.17574L19.8243 5.32426C19.9368 5.43679 20 5.5894 20 5.74853V21.4C20 21.7314 19.7314 22 19.4 22H4.6C4.26863 22 4 21.7314 4 21.4Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        </path>
                        <path d="M8 10L16 10" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M8 18L16 18" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M8 14L12 14" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        Saldos de vendas
                      </p>
                    </button>
                  </a>
                </motion.div>
              </li>
              <li>
                <motion.div
                  whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
                >
                  <a className="" href="#">
                    <button
                      className="transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 text-inherit"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                        notifactions
                      </p>
                    </button>
                  </a>
                </motion.div>
              </li>
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
                whileHover={{ x: [-4, 4, -4, 0], transition: { duration: 0.5 } }}
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
