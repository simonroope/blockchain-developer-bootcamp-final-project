import { useContract } from './useContract';

import dai from '../contracts/Dai.json';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { useEffect } from 'react';

import { ethers } from 'ethers';

export const useCToken = () => {

  const { account, chainId } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

  // Rinkeby (and other test networks) Dai is fixed address 
  const daiAddress = '0x918Fd7cc2F6B6528B443B8C3ffAeF025551f3eb3';

  const cTokenContract = useContract(daiAddress, dai.abi);

  const { setCTokenBalance, cTokenBalance } = useAppContext();

  const fetchCTokenBalance = async () => {
    const cTokenBalance = await cTokenContract.balanceOf(account);
    setCTokenBalance(ethers.utils.formatEther(cTokenBalance));
  };


  return {

    cTokenBalance,
    fetchCTokenBalance

  };
};
