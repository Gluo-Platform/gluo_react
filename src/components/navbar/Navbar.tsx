'use client';
import { useModal } from '@/providers/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import defaultIcon from '../../../public/default.webp';
import NavbarItem from './NavbarItem';

type navPanels = null | 'feeds' | 'social' | 'profile' | 'settings';

export default function Navbar() {
  const { openModal, closeModal } = useModal();
  // const { session } = useSession(); yet to figure this out
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState<navPanels>(null);

  function handlePanelSelection(selection: navPanels) {
    if (selection === activePanel) {
      closeModal();
      return setActivePanel(null);
    }
    setActivePanel(selection);
  }

  return (
    <div className="bg-background flex flex-col-reverse xl:flex-row absolute bottom-0 left-0 right-0 xl:max-w-87.5 xl:w-full xl:left-0 xl:top-0 xl:bottom-0">
      {/* icon navigation */}
      <nav className="relative z-55 bg-background gap-6.25 p-3 flex items-center justify-evenly border-t border-secondary-bg sm:justify-center xl:border-r xl:flex-col xl:p-6.25 xl:justify-start">
        <i
          className={`icon fas fa-home cursor-pointer transition-colors ${pathname.startsWith('/feed') ? 'text-foreground' : 'text-secondary-font'}`}
          onClick={() => handlePanelSelection('feeds')}
        ></i>
        <i
          className={`icon fas fa-users cursor-pointer transition-colors ${pathname.startsWith('/social') ? 'text-foreground' : 'text-secondary-font'}`}
          onClick={() => handlePanelSelection('social')}
        ></i>
        <i
          className={`icon fas fa-plus text-secondary-font cursor-pointer`}
          onClick={() => openModal('createPost')}
        ></i>
        <i
          className={`icon fas fa-search text-secondary-font cursor-pointer`}
          // onClick={}
        ></i>
        <Image
          src={defaultIcon}
          alt="User profile"
          width={30}
          height={30}
          className="rounded-2xl cursor-pointer"
          loading="lazy"
          onClick={() => handlePanelSelection('profile')}
        ></Image>
      </nav>
      {/* navigation panels */}
      <NavbarItem shown={activePanel === 'feeds'}>
        <h2 className="my-5 text-2xl font-medium">Feeds</h2>

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href={`/feed/${''}`}
        >
          <i className="icon fas fa-home" aria-hidden="true"></i>
          Following
        </Link>

        <div
          className="mt-5 flex outline outline-dashed outline-secondary-bg py-2 px-3 rounded-md items-center text-sm gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary hover:outline-primary"
          onClick={() => openModal('newFeed')}
        >
          <i className="fas fa-plus font-bold" aria-hidden="true"></i>
          New feed
        </div>
      </NavbarItem>

      <NavbarItem shown={activePanel === 'social'}>
        <h2 className="my-5 text-2xl font-medium">Social</h2>

        {/* <Link
            className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
            href="/social/chats"
          >
            <i className="icon fas fa-comment"></i>
            Chats
          </Link>
          <Link
            className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
            href="/social/groups"
          >
            <i className="icon fas fa-users"></i>
            Groups
          </Link> */}

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/social/friends"
        >
          <i className="icon fas fa-user-friends" aria-hidden="true"></i>
          Friends
        </Link>

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/social/requests"
        >
          <i className="icon fas fa-user-plus" aria-hidden="true"></i>
          Requests
        </Link>

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/social/blocked"
        >
          <i className="icon fas fa-ban" aria-hidden="true"></i>
          Blocked
        </Link>

        <hr className="text-secondary-bg my-2 border" />

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/social/following"
        >
          <i className="icon fas fa-bell" aria-hidden="true"></i>
          Following
        </Link>
        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/social/followers"
        >
          <i className="icon fas fa-bell" aria-hidden="true"></i>
          Followers
        </Link>
      </NavbarItem>

      <NavbarItem shown={activePanel === 'profile'}>
        <h2 className="my-5 text-2xl font-medium">Profile</h2>

        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href={`/user/${'GluoTesting'}`}
        >
          <i className="icon fas fa-user" aria-hidden="true"></i>
          Profile
        </Link>
        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/me/bookmarks"
        >
          <i className="icon fas fa-bookmark" aria-hidden="true"></i>
          Bookmarks
        </Link>
        <Link
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/me/archive"
        >
          <i className="icon fas fa-history" aria-hidden="true"></i>
          Archive
        </Link>
        {/* opens up a settings modal */}
        <div
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          onClick={() => openModal('settings')}
        >
          <i className="icon fas fa-gear" aria-hidden="true"></i>
          Settings
        </div>
        {/* has to be <a> not <Link> */}
        <a
          className="flex items-center text-xl gap-2 transition-colors duration-300 cursor-pointer text-secondary-font hover:text-primary"
          href="/logout"
        >
          <i className="icon fas fa-sign-out-alt" aria-hidden="true"></i>
          Logout
        </a>
      </NavbarItem>
    </div>
  );
}
