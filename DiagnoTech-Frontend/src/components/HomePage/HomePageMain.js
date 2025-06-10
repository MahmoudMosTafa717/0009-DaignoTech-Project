// components/HomePage/HomePageMain.js
import React from "react";
import {
  HeroImg,
  Whu,
  Statistics,
  Tips,
  Partnerships,
  Faqsection,
  ScrollButtons,
  Chatbot,
} from "./HomePage";

const HomePage = () => {
  return (
    <>
      <HeroImg />
      <Whu />
      <Statistics />
      <Tips />
      <Partnerships />
      <Faqsection />
      <ScrollButtons />
      <Chatbot/>
    </>
  );
};

export default HomePage;
