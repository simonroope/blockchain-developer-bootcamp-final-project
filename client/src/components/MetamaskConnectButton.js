import React from 'react';
import { injected } from '../utils/connectors';
import { useWeb3React } from '@web3-react/core';

import { shortAddress } from '../utils/ethAddressUtils';


const MetamaskConnectButton = () => {

  const { activate, active, account, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  if (active) {
    return (
      <div className="card d-flex flex-row justify-content-between" style={{ width: 350 }}>
        <div className="mx-4">
          {shortAddress(account)}
          <button type="button" className="" onClick={deactivate}>Log Out</button>
        </div> 
      </div>
    );
  }

  return (
    <div className="card d-flex flex-row justify-content-between" style={{ width: 350 }}>
      <div className="mx-4">
        Metamask
      </div>
      <button type="button" className="" onClick={connect}>Connect</button>
    </div>
  );

};

export default MetamaskConnectButton;
