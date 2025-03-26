import React from 'react';
import articleData from './data';
import Word from './Word';

const ReadingComp = () => {
    const lines = articleData.content.split('\n');

    const mappedArticle = lines.flatMap((line, lineIndex) => {
        const splitLine = line.trimStart().split(/(\s+)/);

        
        const mappedLine = splitLine.map((word, index) => {
            if (word.trim() === '') {
                return <Word type="whitespace" id={`${lineIndex}-${index}`} key={`${lineIndex}-${index}`}> </Word>;
            } else {
                return <Word type="word" id={`${lineIndex}-${index}`} key={`${lineIndex}-${index}`}>{word}</Word>;
            }
        });

        return (
            <div className="w-full flex flex-wrap gap-1" key={`line-${lineIndex}`}>
                {mappedLine}
            </div>
        );
    });

    return (
        <div className="reading-comp p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[var(--primary)] mb-4">
                ReadingComp
            </h2>

            <div className="flex flex-col gap-2">
                {mappedArticle}
            </div>
        </div>
    );
};


export default ReadingComp;
