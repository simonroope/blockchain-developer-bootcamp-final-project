import React from 'react';
import BalancesCard from './BalancesCard';
import MetamaskConnectButton from './MetamaskConnectButton';

import useEagerConnect from '../hooks/useEagerConnect';

const Header = () => {

//  const triedEager = useEagerConnect()

  return (

    <nav className="navbar justify-content-between">
      <BalancesCard />
      <MetamaskConnectButton />
    </nav>
  );
};

export default Header;
