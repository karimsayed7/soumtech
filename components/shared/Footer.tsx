

import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import Image from "next/image";

const mainLinks = [
  { label: "الضوابط الإعلانية الخاصة بمنصة", href: "#" },
  { label: "الشروط والأحكام", href: "#" },
  { label: "ترخيص الهيئة العامة للعقار", href: "#" },
  { label: "تواصل معنا", href: "#" },
];

const sectionLinks = [
  { label: "مكتبة الدعم", href: "#" },
  { label: "الأسئلة الشائعة", href: "#" },
];

const socialLinks = [
  {
    href: "#",
    icon: <FaLinkedinIn className="size-4" />,
  },
  {
    href: "#",
    icon: <FaXTwitter className="size-4" />,
  },
  {
    href: "#",
    icon: <FaInstagram className="size-4" />,
  },
];

function FooterTitle({ title }: { title: string }) {
  return (
    <div className="relative py-1 w-fit">
      <p className="text-[18px] font-extrabold text-[#171D5B]">{title}</p>
      <span className="absolute mt-[2px] right-0 h-[3px] w-1/2 bg-yellow-500 animate-underline-grow" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className=" bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pr-0 lg:pr-20">
      <div className="mx-auto w-full px-6 pt-10 pb-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Logo & About */}
          <div className="flex flex-col items-start">
            <Image src={"/assets/Logo2.svg"} alt="logo" width={80} height={80}/>

            <p className="mt-3 max-w-sm text-[15px] leading-8 text-gray-400">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد
              تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد
              مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة
              عدد الحروف التى يولدها التطبيق.
            </p>

            <div className="mt-3 flex gap-3">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex size-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:border-yellow-500 hover:text-[#171D5B]"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Links */}
          <div className="flex flex-col gap-8">
            <FooterTitle title="القائمة الرئيسية" />

            <ul className="space-y-4">
              {mainLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-gray-500 transition hover:text-[#171D5B]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            <FooterTitle title="الأقسام" />

            <ul className="space-y-4">
              {sectionLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-gray-500 transition hover:text-[#171D5B]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-8">
            <FooterTitle title="تواصل معنا" />

            <div className="space-y-4 text-[15px] text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-gray-500" />
                <span>الرياض حي الملك فيصل، السعودية</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="size-5 text-gray-500" />
                <span dir="ltr">+966 570 212 216</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="size-5 text-gray-500" />
                <span>info@soum.tech</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-sm text-gray-500">
            © جميع الحقوق محفوظة - لسومتك 2023
          </p>
        </div>
      </div>
    </footer>
  );
}