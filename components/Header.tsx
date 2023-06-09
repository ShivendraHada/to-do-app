"use client";

import Image from "next/image";
import Logo from "@/assets/images/logo.jpg";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";

function Header() {
  const [board, setSearchString] = useBoardStore((state) => [
    state.board,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      // Comment/uncomment below code to Enable OpenAI responses
      // const suggest = await fetchSuggestion(board);

      // Comment/uncomment below code to get random quotes instead of OpenAI responses
      const suggest = await fetch("https://api.quotable.io/random")
        .then((response) => response.json())
        .then((data) => data.content);

      setSuggestion(suggest);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-white/20">
        <Image
          src={Logo}
          alt="To-do App logo"
          width={300}
          height={100}
          className="shadow-md w-44 md:w-56 mb-8 md:mb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center  bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="mx-1 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden aria-label="Search">
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar
            className="shadow-md"
            name="Shivendra Hada"
            round
            size="50"
            color="#fbce09"
            fgColor="#322a0d"
          />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-5">
        <p className="flex p-5 items-center text-sm font-bold pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#3f370c]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 md:w-15 mr-1 ${
              loading && "animate-spin"
            }`}
          />
          <span>
            {suggestion && !loading
              ? suggestion
              : "Generating an awesome quote just for you..."}
          </span>
        </p>
      </div>
    </header>
  );
}

export default Header;
