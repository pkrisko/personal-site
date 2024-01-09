import React from 'react';
import classNames from 'classnames';

const Experience = ({ className, children, src, title }) => {
  return (
    <div className={classNames("flex flex-col border border-px border-white", className)}>
      <div className="">
        <img src={src} className="" />
      </div>
      <div className="p-4">
        <h3 className="text-2xl mb-2">{title}</h3>
        {children}
      </div>
    </div>
  )
}

export default Experience;
