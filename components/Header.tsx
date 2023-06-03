"use client";

import Image from "next/image";
import Logo from "@/assets/images/logo.jpg";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "@/utils/fetchSuggestion";

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
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10">
        <Image
          src={Logo}
          alt="To-do App logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar name="Shivendra Hada" round size="50" color="#fbce08" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex p-5 items-center text-sm font-bold pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#917600]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 md:w-15 mr-1 text-[#917600] ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
