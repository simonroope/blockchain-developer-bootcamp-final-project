import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import useEth from '../hooks/useEth';
import { useCToken } from '../hooks/useCToken';

import DepositDaiModal from './DepositDaiModal';

const BalancesCard = () => {

  const { account } = useWeb3React();
  const { ethBalance, fetchEthBalance } = useEth();
  const { fetchCTokenBalance, cTokenBalance, deposit } = useCToken();

  useEffect(() => {

    if (account) {
      fetchEthBalance();
      fetchCTokenBalance();
    }
  }, [account]);


  return (

      <div className="card d-flex justify-content-between align-items-center">
        <div className="m-2">
          ETH Balance: {ethBalance}
        </div>
        <div className="mx-2 mb-1">
          DAI Balance: {cTokenBalance}
        </div>
        <DepositDaiModal />
      </div>

  );

};

export default BalancesCard;
