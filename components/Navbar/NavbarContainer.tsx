import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";
import Slider from "../Buttons/Slider";

export default function NavbarContainer() {
  let router = useRouter();
  let handleOnClick = (path: string) => {
    router.push(path);
  };
  return (
    <div className="flex w-full items-center px-4 py-2 border-b border-gray-200 justify-between">
      <div className="flex gap-4 items-center w-full">
        <Image
          src="https://openfeature.dev/img/logo-dark.svg"
          alt="Logo"
          width={100}
          height={100}
        />
        <div>
          <p className="cursor-pointer" onClick={() => handleOnClick("/docs")}>Docs</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <IoLogoGithub className="text-xl cursor-pointer" />
        <Slider />
      </div>
    </div>
  );
}
