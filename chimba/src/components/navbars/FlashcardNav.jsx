import React from 'react'
import { Outlet } from 'react-router-dom'
import Sideicon from './Sideicon'

const FlashcardNav = () => {
    const style = {color: 'black', fontSize: '50px', fontFamily: 'var(--font-carlito)'}

    const activeStyle = {textDecoration: 'underline', textDecorationColor: '#ff0037', ...style}

    const styles = [style, activeStyle]
  

    return (
        <div className=' w-full left-0 flex flex-col justify-start'>
            <div className='flex w-full  pb-8 flex-row items-center justify-around '>
                <Sideicon customStyle={styles} link=''>Review</Sideicon>
                <Sideicon customStyle={styles} link='add'>Add</Sideicon>
            </div>

            <Outlet />
        </div>
    )
}

export default FlashcardNav