import React from 'react';
import articleData from './data';
import Word from './Word';
import './comprehension.css';

const ReadingComp = () => {
    const splitArticle = articleData.content.split(/(\s+)/);

    const mappedArticle = splitArticle.map((word, index) => {
        if (word === ' ') {
            return <Word type="whitespace" id={index} className="whitespace"> </Word>;
        } else if (word.includes('\n')) {
            return <Word type="newline" className="newline">{word} <br /></Word>;
        } else {
            return <Word type="word" id={index} className="word">{word}</Word>;
        }
    });

    return (
        <div className='reading-comp'>
            <h2>ReadingComp</h2>
            <div className="article-container">
                {mappedArticle}
            </div>
        </div>
    );
};

export default ReadingComp;
