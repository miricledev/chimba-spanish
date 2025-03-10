import React, { useEffect, useState } from 'react'
import { FaCircleArrowUp } from "react-icons/fa6";
import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import Page5 from './Page5'

const Home = () => {

    const [scrollArrow, setScrollArrow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
          
            if(window.scrollY > window.innerHeight / 2){
                setScrollArrow(true)
            } else{
                setScrollArrow(false)
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, [])

    return(
        <div className='flex flex-col justify-start overflow-y-scroll scroll-snap-y scroll-snap-mandatory'>
            <Page1 />
            <Page2 />
            <Page3 />
            <Page4 />
            <Page5 />
            {scrollArrow && <FaCircleArrowUp className='animate-fade-in fixed bottom-4 left-1/2 -translate-x-1/2 text-6xl opacity-20 hover:opacity-65 btn-hover' 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />}
        </div>
        
    )

}


export default Home