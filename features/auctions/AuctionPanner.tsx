import React from "react";
import Image from "next/image";
import { AuctionStatus } from "../../api/getAuctions";

type Props = {
  totalCount: number;
  status: AuctionStatus;
};

const STATUS_LABELS: Record<AuctionStatus, string> = {
  ongoing: "عدد المزادات القائمة",
  upcoming: "عدد المزادات القادمة",
  ended: "عدد المزادات المنتهية",
};

export default function AuctionPanner({ totalCount, status }: Props) {
  return (
    <div>
      <div className="relative w-fit mx-0 sm:mx-10">
        <p className="text-[27px] font-extrabold text-[#171D5B]">المزادات</p>
        <span className="absolute mt-[2px] right-0 h-[4px] w-1/2 bg-yellow-500 animate-underline-grow" />
      </div>
      <div className="relative left-1/2 right-1/2 -mx-[51vw] w-screen bg-[#F3F4F6] mt-2">
        <div className="max-w-[1300px] mx-auto py-5 flex items-center justify-between px-10 sm:px-22">
          <div>
            <p className="text-[20px] font-extrabold text-[#171D5B]">
              كل المزادات
            </p>
            <div className="flex items-center gap-2 text-[#171D5B]">
              <Image
                src="/assets/auctionLogo.svg"
                className="-mt-1"
                alt="auctionLogo"
                width={18}
                height={20}
              />
              <span className="text-lg ">{STATUS_LABELS[status]}</span>
              <span className="text-red-500 font-semibold -mt-1">
                ({totalCount})
              </span>
            </div>
          </div>

          <div className="md:flex items-center gap-5 hidden">
            <Image
              src="/assets/الهيئة العامة للعقار دارك.svg"
              alt="logo2"
              width={140}
              height={20}
            />
            <Image
              src="/assets/infath-dark.svg"
              alt="logo1"
              width={80}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
