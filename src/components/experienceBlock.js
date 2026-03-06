import React from 'react';
import classNames from 'classnames';

const Experience = ({ className, children, src, media, title, subTitle }) => {
  return (
    <div className={classNames("flex flex-col border border-px border-white", className)}>
        <div className="relative w-full" style={{ paddingTop: '75%' }}>
          <div className="absolute top-0 left-0 w-full h-full">
            {media ?? (
              <img
                src={src}
                alt={`Screenshots of ${title}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      <div className="p-4">
        <h3 className="text-2xl mb-2">{title}</h3>
        <h4 className="text-xl mb-2 font-fantastique">{subTitle}</h4>
        {children}
      </div>
    </div>
  )
}

export default Experience;
