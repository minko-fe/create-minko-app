import type { FC } from 'react'
import logo from './images/logo.svg'

const Home: FC = () => {
  return (
    <div className='m-[0_auto] max-w-[1920px]'>
      <div className='flex h-[106px] w-full items-center bg-[#000000] pl-[15%] text-[red]'>
        <img src={logo.src}></img>
      </div>
    </div>
  )
}

export default Home
