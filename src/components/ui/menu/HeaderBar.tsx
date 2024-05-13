// Framework
import { useRouter } from "next/router";

// Tipagem
import { MenuProps, RouterColors } from "./SideBar";

// Dados
import routerColors from './../../../data/routerColors.json'
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { truncateString } from "@/utils/mask/stringMask";

export default function HeaderBar({ isOpen }: MenuProps) {
    const router = useRouter();

    let bgColorClass: string = '';

    // Atribua os dados do JSON a uma variável para acessá-los
    const routeColors: RouterColors = routerColors;

    // Obtenha a cor da rota atual
    const routeColor = routeColors[router.pathname];
    if (routeColor === "table") {
        bgColorClass = "bg-[#fa6602]";
    } else {
        bgColorClass = "bg-[#fa6602]";
    }

    const firstPart = router.pathname.split("/")[1];
    const secondPart = router.pathname.split("/")[2];
    const { user } = useContext(AuthContext)

    return (
        <div className="p-4 xl:ml-[19em] 2xl:ml-80">
            <nav className={`block w-full max-w-full ${bgColorClass} text-white shadow-none rounded-xl transition-all px-3 py-2 overflow-auto`}>
                <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                    <div className="capitalize">
                        <nav className="w-max">
                            <ol className="flex z-50 flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                                <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                                    <p className="block antialiased leading-relaxed text-inherit capitalize font-sans text-sm leading-normal text-white font-normal  transition-all hover:font-bold ">
                                        dashboard
                                    </p>

                                    <span className="text-white-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                                        /
                                    </span>
                                </li>
                                <li className=" flex items-center text-white-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-white-500">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-white-900 font-normal">
                                        {firstPart}
                                    </p>
                                    <span className="text-white-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                                        {secondPart && "/"}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                        <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white-900">
                            {firstPart}
                        </h6>
                    </div>
                    <div className="flex items-center small-screen:flex-col">
                        <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                            <label
                                htmlFor="default-search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full md:p-2 p-1 md:ps-10 ps-10 text-sm text-black-900 border rounded-lg bg-white-50 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black"
                                    placeholder="Search Mockups, Logos..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex ">
                            <button onClick={() => isOpen && isOpen(true)} className="hover:bg-blue-700 relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-full text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden">
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        strokeWidth="3"
                                        className="h-6 w-6 text-white"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </button>

                            <a href="#">
                                <button
                                    className="middle none font-sans font-bold center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 hidden items-center gap-1 px-4 xl:flex"
                                    type="button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="h-5 w-5 text-white"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <p className="font-sans font-bold center text-white">{truncateString(String(user?.username), 5)}</p>
                                </button>

                                <button
                                    className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                                    type="button"
                                >
                                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            className="h-5 w-5 text-white"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </a>

                            <button
                                className="hover: relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-white hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                                type="button"
                            >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="h-5 w-5 text-blue-gray-500"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </button>

                            <button
                                className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-white hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                                type="button"
                            >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        className="h-5 w-5 text-blue-gray-500"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}