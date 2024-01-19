import React from 'react';
import classNames from 'classnames';

const Experience = ({ className, children, src, title, subTitle }) => {
  return (
    <div className={classNames("flex flex-col border border-px border-white", className)}>
        <img src={src} alt={`Screenshots of ${title}`} />
      <div className="p-4">
        <h3 className="text-2xl mb-2">{title}</h3>
        <h4 className="text-lg mb-2 font-mono">{subTitle}</h4>
        {children}
      </div>
    </div>
  )
}

export default Experience;
