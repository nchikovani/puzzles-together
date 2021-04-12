import React from 'react';
import './style.scss'

interface IPreLoadingProps {
  loadingIsComplete: boolean
}

const PreLoading: React.FC<IPreLoadingProps> = ({loadingIsComplete, children}) => {

  return (
    <>
      {
        loadingIsComplete
        ? children
        : <div className='pre-loading'>
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
      }
    </>

  )
}

export default PreLoading;