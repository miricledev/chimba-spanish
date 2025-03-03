import React from 'react'
import './Home.css'

const Home = () => {

    return(
        <div className='main-page'>
            <div className='row r1'>
                <h2 className='intro outline-text'>¡Óyeme!</h2>
                <img className='image' src='chimba_logo.png' />
                <h3 className='intro outline-text'>This Ain’t Your Average Spanish Class</h3>
            </div>
            <div className='row r2'>
                <img className='image' src='sa.png' />
                <div className='column'>
                    <h2 className='description outline-text black'>Speak Spanish Your Way – Every Dialect, Every Vibe</h2>
                    <p className='description-body outline-text black'>
                        Think Spanish is just “one-size-fits-all”? Nah, parce! From the rolling r’s of Argentina to the smooth flow of Colombian Spanish, 
                        we’ve got every dialect covered. Learn real-life Spanish, complete with slang, accents, and local expressions, 
                        so you sound like a native, not a textbook. ¡Vamos, let’s get started! </p>
                </div>
                <img className='image' src='spain.png' />
                
            </div>
            <div className='row r2'>
                <div className='column'>
                    <h2 className='description outline-text black'>
                        Join thousands of learners mastering real Spanish – no boring textbooks, just the way natives speak
                    </h2>
                    <img className='stars-image' src='5stars.png' />
                </div>
            </div>
            <div className='row r1'>
                <img className='image' src='earth.png' />
                <h3 className='description outline-text'>Connect with users all over the GLOBE, sharing thoughts, ideas and making new friends</h3>
            </div>
            <div className='row r1'>
                <h3 className='description outline-text'>Leverage the latest cutting-edge AI-powered learning resources to maximise your native fluency and naturality</h3>
                <img className='image' src='ai.png' />
            </div>
        </div>
    )

}

export default Home