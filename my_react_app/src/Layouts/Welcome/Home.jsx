import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Carousel, initTE } from "tw-elements"; //to tailwind control
import slide1 from "../../Images/slide_1.png";
import slide2 from "../../Images/slide_2.png";
import slide3 from "../../Images/slide_3.png";
import slide4 from "../../Images/slide_4.png";
import slide5 from "../../Images/slide_5.png";
import { toastify } from "../../Helper";

const Home = () => {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    initTE({ Carousel });
    if (authState.auth && authState.auth.user.role) {
      toastify("warn", 403, "Location is locked by your role")
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
  }, [])
  return (
    <div className="max-h-screen overflow-y-auto mx-auto px-10 md:px-20 xl:px-28">
      <div id="carouselExampleCaptions" className="relative bg-dark/[0.025] dark:bg-light/[0.025] rounded-md" data-te-carousel-init data-te-carousel-slide>
        {/*Carousel items*/}
        <div className="relative mt-14 max-w-4xl mx-auto overflow-hidden after:clear-both after:block after:content-['']">
          {/*1*/}
          <div className="relative pb-2 float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none" data-te-carousel-active data-te-carousel-item style={{ backfaceVisibility: 'hidden' }}>
            <img src={slide1} className="block w-full -mt-6" alt="..." />
            <div className="-mt-4 w-2/3 mx-auto text-center text-dark/75 dark:text-light/75 text-xs md:text-lg">
              Build your expertise, land your dream job! We guide fresh graduates to develop the professional skills required by ambitious companies            </div>
          </div>
          {/*2*/}
          <div className="relative pb-2 float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none" data-te-carousel-item style={{ backfaceVisibility: 'hidden' }}>
            <img src={slide2} className="block w-full -mt-6" alt="..." />
            <div className="-mt-4 w-2/3 mx-auto text-center text-dark/75 dark:text-light/75 text-xs md:text-lg">
              Step by step towards professional excellence. Join our community and get the support and guidance to overcome the experience barrier and reach ideal job opportunities
            </div>
          </div>
          {/*3*/}
          <div className="relative pb-2 float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none" data-te-carousel-item style={{ backfaceVisibility: 'hidden' }}>
            <img src={slide3} className="block w-full -mt-6" alt="..." />
            <div className=" -mt-4 w-2/3 mx-auto text-center text-dark/75 dark:text-light/75 text-xs md:text-lg">
              Confidently enter the job market. We help you gain essential experience and build your resume in the best ways to achieve professional success
            </div>

          </div>
          {/*4*/}
          <div className="relative pb-2 float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none" data-te-carousel-item style={{ backfaceVisibility: 'hidden' }}>
            <img src={slide4} className="block w-full -mt-6" alt="..." />
            <div className=" -mt-4 w-2/3 mx-auto text-center text-dark/75 dark:text-light/75 text-xs md:text-lg">
              Experience is not a barrier! Tailored job opportunities for fresh graduates to develop their skills and embark on their professional journey with confidence
            </div>
          </div>
          {/*5*/}
          <div className="relative pb-2 float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none" data-te-carousel-item style={{ backfaceVisibility: 'hidden' }}>
            <img src={slide5} className="block w-full -mt-6" alt="..." />
            <div className=" -mt-4 w-2/3 mx-auto text-center text-dark/75 dark:text-light/75 text-xs md:text-lg">
              Creating opportunities for beginners. Join us and get an exceptional chance to develop your abilities and gain the necessary experience for achieving excellence
            </div>
          </div>
          {/*
            slidesData.map((slide, idx) => {
              return <SingleSlide slide={slide} idx={idx} key={idx} />
            })
          */}
        </div>
        {/*Carousel controls - prev item*/}
        <button className="text-dark/50 dark:text-light/50 hover:opacity-75 absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:outline-none focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none" type="button" data-te-target="#carouselExampleCaptions" data-te-slide="prev">
          <span className="inline-block h-5 w-5 md:h-10 md:w-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 md:h-10 md:w-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </span>
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Previous</span>
        </button>
        {/*Carousel controls - next item*/}
        <button className="text-dark/50 dark:text-light/50 hover:opacity-75 absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:outline-none focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none" type="button" data-te-target="#carouselExampleCaptions" data-te-slide="next">
          <span className="inline-block h-5 w-5 md:h-10 md:w-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 md:h-10 md:w-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Next</span>
        </button>
      </div>
    </div>
  );
};
export default Home;