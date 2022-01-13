import React, { useState, useEffect } from 'react';
import { injected } from '../utils/connectors';
import { useWeb3React } from '@web3-react/core';

import { shortAddress } from '../utils/ethAddressUtils';

const MetamaskConnectButton = () => {

  const { activate, active, account, deactivate } = useWeb3React();

  const [isActive, setIsActive] = useState(active);

  const connect = async () => {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    const tryActivate = async () => {
      await activate(injected)
    };
    tryActivate();
  }, []);

  if (!active) {

    return (

      <div className="card d-flex flex-row justify-content-between align-items-center">
        <div className="mx-4">
          Metamask
        </div>
        <button type="button" className="btn btn-primary" onClick={connect}>Connect</button>
      </div>
    );
  }

  return (

    <div className="card d-flex flex-row justify-content-between align-items-center"> 
      <div className="mx-4">
        {shortAddress(account)}
      </div>
        <button type="button" className="btn btn-primary" onClick={deactivate}>Log Out</button>
    </div>

  );
};

export default MetamaskConnectButton;
