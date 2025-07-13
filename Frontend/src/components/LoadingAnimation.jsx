import React from 'react'
import loadingAnimation from '../assets/loading.gif'

export default function LoadingAnimation({size}) {
    return (
        <div className='w-full flex items-center justify-center'>
            <img src={loadingAnimation}
                className={`${size ? 'w-8' : 'w-24' }`}
                alt=""/>
        </div>
    )
}
