import { useContract } from './useContract';

import { useDaiAddress } from './useDaiAddress';
import dai from '../contracts/Dai.json';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { useEffect } from 'react';

import { ethers } from 'ethers';

export const useCToken = () => {

  const { account, chainId } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

//  const { daiAddress } = useDaiAddress();
//  const daiAddress = '0x5106d9816BC1dDc2ccf77d299266978070da2024';
//  console.log(`Dai Address: ${daiAddress}`); 

// Rinkeby
//  const daiAddress = '0x918Fd7cc2F6B6528B443B8C3ffAeF025551f3eb3';

  const daiAddress = (chainId == 4) ? '0x918Fd7cc2F6B6528B443B8C3ffAeF025551f3eb3' : '0xE38d56E19a986bFB3DdaB77D17921Cccac6666F2';

  const cTokenContract = useContract(daiAddress, dai.abi);

  const { setCTokenBalance, setTxnStatus, cTokenBalance } = useAppContext();

  const fetchCTokenBalance = async () => {
    const cTokenBalance = await cTokenContract.balanceOf(account);
    setCTokenBalance(ethers.utils.formatEther(cTokenBalance));
  };

  const deposit = async (amount) => {
    if (account) {
      try {
        setTxnStatus('LOADING');

        const txn = await cTokenContract.mint(account,ethers.utils.parseEther(amount.toString()));
        await txn.wait(1);

        await fetchCTokenBalance();

        setTxnStatus('COMPLETE');
      } catch (error) {
        setTxnStatus('ERROR');
      }
    }
  };


  return {

    cTokenBalance,
    fetchCTokenBalance,
    deposit,
  };
};
