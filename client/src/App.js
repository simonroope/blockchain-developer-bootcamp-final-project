import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import { ethers } from 'ethers';

import Header from './components/Header';
import Bond from './components/Bond';


function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {

  return (

    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />
        <Bond />
      </Web3ReactProvider>
    </AppContextProvider>

  );
};

export default App;
