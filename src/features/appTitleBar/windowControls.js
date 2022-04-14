import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { APP_TITLE_BAR_GET_STATUS, APP_TITLE_BAR_MAXIMIZE_APP, APP_TITLE_BAR_MINIMIZE_APP } from '../../ipcChannels';

const triggerAction = action => ipcRenderer.send(action);

export const WindowControls = () => {
  const [isMaximizable, setIsMaximizable] = useState();
  const [isMaximized, setIsMaximized] = useState();
  const [isMinimizeable, setIsMinimizeable] = useState();

  const updateStatus = (status) => {
    setIsMaximizable(status.isMaximizable);
    setIsMaximized(status.isMaximized);
    setIsMinimizeable(status.isMinimizeable);
  };

  useEffect(() => {
    ipcRenderer.on(APP_TITLE_BAR_GET_STATUS, (event, status) => updateStatus(status));
    ipcRenderer.send(APP_TITLE_BAR_GET_STATUS);

    return () => {
      ipcRenderer.removeAllListeners(APP_TITLE_BAR_GET_STATUS);
    };
  }, []);

  return (
    <div className="window-controls">
      <button
        type="button"
        tabIndex={-1}
        className="window-control window-minimize"
        disabled={!isMinimizeable}
        onClick={() => triggerAction(APP_TITLE_BAR_MINIMIZE_APP)}
      >
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d="M 0,5 10,5 10,6 0,6 Z" />
        </svg>
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="window-control window-maximize"
        disabled={!isMaximizable}
        onClick={() => triggerAction(APP_TITLE_BAR_MAXIMIZE_APP)}
      >
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d={isMaximized ? 'm 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z' : 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z'} />
        </svg>
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="window-control window-close"
        onClick={() => window.close()}
      >
        <svg aria-hidden="true" version="1.1" width="10" height="10">
          <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
        </svg>
      </button>
    </div>
  );
};
