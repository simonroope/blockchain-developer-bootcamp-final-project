import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { AppContextProvider } from './AppContext';
import { ethers } from 'ethers';

import Header from './components/Header';
import Title from './components/Title';
import Bond from './components/Bond';
import BondOptions from './components/BondOptions';


function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {

  if (window.ethereum) {
    window.ethereum.on('networkChanged', () => window.location.reload());
  }

  return (

    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />
        <Title />
        <Bond />
        <BondOptions />
      </Web3ReactProvider>
    </AppContextProvider>

  );
};

export default App;
