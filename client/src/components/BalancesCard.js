import React, { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import useEth from '../hooks/useEth';

const BalanceCard = () => {

  const { account } = useWeb3React();
  const { ethBalance, fetchEthBalance } = useEth();

  useEffect(() => {

    if (account) {
      fetchEthBalance();
    }
  }, [account]);


  return (

    <>
      <div className='card' style={{ maxWidth: 300 }}>
        <div>
          Account {account}
        </div>
        <div>
          Balance {ethBalance}
        </div>
      </div>
    </>

  );

};

export default BalanceCard;
