import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Sideicon from './Sideicon'

const SocialBar = () => {

    const style = {color: 'black', fontSize: '50px', fontFamily: 'var(--font-carlito)'}

    const activeStyle = {textDecoration: 'underline', textDecorationColor: '#ff0037', ...style}

    const styles = [style, activeStyle]
  

    return (
        <div className='ml-5 p-3 w-full gap-8 flex flex-col justify-start'>
            <div className='flex flex-row items-center justify-around'>
                <Sideicon customStyle={styles} link=''>Find Users</Sideicon>
                <Sideicon customStyle={styles} link='inbox'>Inbox</Sideicon>
            </div>

            <Outlet />
        </div>
    )
}

export default SocialBar