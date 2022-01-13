import React from 'react';
import BalancesCard from './BalancesCard';
import MetamaskConnectButton from './MetamaskConnectButton';

const Header = () => {

  return (

  <div className="container py-2">

    <nav className="navbar justify-content-between">
      <BalancesCard />
      <MetamaskConnectButton />
    </nav>

  </div> 

  );
};

export default Header;
