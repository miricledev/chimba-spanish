import React, { useEffect, useState } from 'react'
import { FaCircleArrowUp } from "react-icons/fa6";
import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'
import Page5 from './Page5'
import CountryBio from './CountryBio';
import { countryInfo } from './country';

const Home = () => {

    const [scrollArrow, setScrollArrow] = useState(false)

    const info = [...countryInfo]

    const mappedInfo = info.map((c, index) => {

        const formatter = (string) => {
            return string.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ));
        }

        const desc = formatter(c.description)
        const mtv = formatter(c.motive)
        const st = formatter(c.subtitle)
        
        return(
            <CountryBio key={index} {...c} description={desc} motive={mtv} subtitle={st} />
        )
    })

    useEffect(() => {
        const handleScroll = () => {
          
            if(window.scrollY > 0){
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
            {mappedInfo}

            {scrollArrow && <FaCircleArrowUp className='z-70 animate-swoop-up fixed bottom-4 left-1/2 -translate-x-1/2 text-6xl opacity-20 hover:opacity-65 btn-hover' 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />}
        </div>
        
    )

}


export default Home