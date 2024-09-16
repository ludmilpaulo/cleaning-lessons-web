"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaBars, FaTimes } from "react-icons/fa";

interface SidebarProps {
  setActiveComponent: (component: string) => void;
  navigation: {
    name: string;
    component: string;
    icon: React.ElementType; // Change to React.ElementType
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Mobile menu */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40 flex lg:hidden" onClose={setSidebarOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          {/* Mobile Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="absolute top-0 right-0 pt-2 -mr-12">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Fechar menu</span>
                  <FaTimes className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 space-y-4 px-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveComponent(item.component);
                        setSidebarOpen(false);
                        console.log(`Navigated to ${item.component}`);
                      }}
                      className="group flex items-center px-4 py-2 text-lg font-semibold rounded-md hover:bg-indigo-500 w-full text-left"
                    >
                      <item.icon className="mr-3 h-6 w-6" /> {/* Render the icon */}
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <nav className="mt-5 flex-1 space-y-4 px-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveComponent(item.component);
                  console.log(`Navigated to ${item.component}`);
                }}
                className="group flex items-center px-4 py-2 text-lg font-semibold rounded-md hover:bg-indigo-500 w-full text-left"
              >
                <item.icon className="mr-3 h-6 w-6" /> {/* Render the icon */}
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Abrir menu</span>
          <FaBars className="h-6 w-6 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
