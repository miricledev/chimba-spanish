import React, { forwardRef } from 'react'

const Input = forwardRef(({children, style}, ref) => {
    return (
        <div style={style} className='flex flex-col'>
            <label className='font-carlito'>{children}</label>
            <input 
                type={children==='Password' ? 'password' : 'text'}
                required
                ref={ref}
                className='border border-gray-300 p-2 rounded-xl w-100'
            />
        </div>
    )
})

export default Input