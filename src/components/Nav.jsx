import Link from 'next/link'

const NavComponent = () => {
  return (
    <nav className="relative top-0 z-50 w-full border-b bg-white">
      {/* ====================================================================== */}
      <div className="page_width_wide border-bF relative left-0 right-0 mx-auto h-14 px-4">
        <Link href="/" passHref>
          <div className="bg-blue-400F z-80 mx-autoF NOTrounded absolute top-0 bottom-0 left-0 right-0 my-auto h-7 w-40 cursor-pointer border border-transparent">
            <img
              className="h-full w-full object-contain py-0 pr-0"
              src="/logo_min.svg"
              alt="logo"
            />
          </div>
        </Link>
        {/* ====================================================================== */}
        <div className="absolute right-0 top-1.5 hidden">
          <div className="bg_accent_colorF box_radius relative inline-block h-9 cursor-pointer bg-blue-500 px-5 text-sm font-semibold leading-8 text-white">
            Login
          </div>
        </div>
      </div>
      {/* ====================================================================== */}
    </nav>
  )
}

export default NavComponent
