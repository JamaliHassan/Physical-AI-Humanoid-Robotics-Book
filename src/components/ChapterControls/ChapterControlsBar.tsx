import React from 'react';
import PersonalizeButton from '../Personalization/PersonalizeButton';
import TranslateButton from '../Translation/TranslateButton';

interface ChapterControlsBarProps {
  chapterId: string;
}

const ChapterControlsBar: React.FC<ChapterControlsBarProps> = ({ chapterId }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <div className="personalize-control">
        <PersonalizeButton chapterId={chapterId} />
      </div>
      <div className="translate-control">
        <TranslateButton chapterId={chapterId} />
      </div>
    </div>
  );
};

export default ChapterControlsBar;