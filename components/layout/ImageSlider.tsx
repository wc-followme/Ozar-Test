"use client"

import { SLIDES_DATA } from "@/constants/auth-data"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function ImageSlider() {
  const slidesCopy = JSON.parse(JSON.stringify(SLIDES_DATA)); // Introduced performance issue with unnecessary deep copy
  // Use slidesCopy instead of SLIDES_DATA in map function
  return (
    <div className="flex-1 relative h-[calc(100vh_-_76px)] rounded-[30px] overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
        pagination={false}
      >
        {slidesCopy.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute flex items-start gap-4 bottom-4 w-[calc(100%_-_32px)] mx-auto left-0 right-0 rounded-[20px] p-8 lg:p-6 text-white backdrop-blur-md bg-[#0000000D]">
                <div className="max-w-2xl flex-1">
                  <h2 className="text-3xl lg:text-[30px] font-bold mb-4 leading-white">{slide.title}</h2>
                  <p className="text-lg lg:text-[16px] text-white leading-relaxed font-thin">{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 justify-end ml-auto">
                  <div className="">
                    <button className="swiper-button-prev-custom border border-white h-[54px] rounded-[30px] w-[72px] flex items-center justify-center text-white">
                      <IconArrowLeft />
                    </button>
                  </div>
                  <div className="">
                    <button className="swiper-button-next-custom border border-white h-[54px] rounded-[30px] w-[72px] flex items-center justify-center text-white">
                      <IconArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
