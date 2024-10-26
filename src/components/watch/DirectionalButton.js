import React from 'react';
import classNames from 'classnames';

const DirectionalButton = ({ onClick, className, children }) => {
  return (
    <button className={classNames("bg-gray-800 text-white px-4 py-2 rounded flex justify-center", className)} onClick={onClick}>
      {children}
    </button>
  );
}

export default DirectionalButton;
