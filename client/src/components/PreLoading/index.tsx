import React, {FunctionComponent} from 'react';
import './style.scss'

interface PreLoadingPropsTypes {
  loadingIsComplete: boolean
}

const PreLoading: FunctionComponent<PreLoadingPropsTypes> = (props) => {

  return (
    <>
      {
        props.loadingIsComplete
        ? props.children
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