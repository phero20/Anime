import React from 'react'
import loadingAnimation from '../assets/loading.gif'

export default function LoadingAnimation() {
    return (
        <div className='w-full flex items-center justify-center'>
            <img src={loadingAnimation}
                className='w-24'
                alt=""/>
        </div>
    )
}
