import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href={"/"}>
      <Image src={"/assets/Logo.svg"} alt='logo' width={80} height={30} className='md:block hidden'/>
      <Image src={"/assets/Logo2.svg"} alt='logo' width={80} height={30} className='md:hidden block'/>
    </Link>
  )
}