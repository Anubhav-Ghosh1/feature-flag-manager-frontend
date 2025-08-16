import React from "react";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  let router = useRouter();
  let buttonStyle =
    "px-3 py-2 text-lg text-white font-medium rounded-sm transition-all ease-in duration-200";
  let cardData = [
    {
      id: 1,
      title: "What's a Feature Flag?",
      description:
        "Feature flags are a software development technique that allows teams to enable, disable or change the behavior of certain features or code paths in a product or service, without modifying the source code.",
    },
    {
      id: 2,
      title: "Why use Feature Manager?",
      description:
        "Feature Manager provides a centralized way to manage feature flags, making it easier for teams to control the rollout of new features and gather feedback.",
    },
  ];
  return (
    <div>
      <div className="flex flex-col items-center justify-between p-24 gap-9">
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl font-bold cursor-default text-gray-900">
            Feature Manager
          </p>
          <p className="text-lg cursor-default text-gray-600">
            Allowing people to manage feature flags with ease
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className={`${buttonStyle} cursor-pointer bg-purple-600 hover:bg-purple-700`}
          >
            Learn More
          </button>
          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className={`${buttonStyle} cursor-pointer bg-gray-700 hover:bg-gray-800`}
          >
            Get Started
          </button>
        </div>
        <div className="flex w-full justify-between mt-24 gap-20">
          {cardData.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center gap-2 w-fit"
            >
              <p className="text-xl cursor-pointer font-semibold text-gray-900 w-fit">
                {card.title}
              </p>
              <p className="font-medium cursor-pointer text-gray-500 text-center w-7/10">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
