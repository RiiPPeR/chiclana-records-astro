import { useState } from "react";

interface DropDownProps {
    isLoggedIn: boolean;
}

export const DropDown = ({ isLoggedIn }: DropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative inline-block text-left z-[9999]">
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-center w-full rounded-md 
                    border border-gray-300 shadow-sm px-4 py-2 bg-tra 
                    text-sm font-medium text-gray-700 hover:bg-gray-50 
                    focus:outline-none"
                >
                    Options
                    <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 
                    rounded-md shadow-lg ring-1 ring-black ring-opacity-5
                    focus:outline-non z-[9999] bg-black/40 backdrop-blur-md"
                    role="menu"
                >
                    <div className="py-1" role="none">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 
                            hover:bg-gray-100"
                            role="menuitem"
                        >
                            Account settings
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100"
                            role="menuitem"
                        >
                            Support
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700
                            hover:bg-gray-100"
                            role="menuitem"
                        >
                            License
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}