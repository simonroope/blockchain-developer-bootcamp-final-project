import { useContract } from './useContract';

import dai from '../contracts/Dai.json';

import useIsValidNetwork from '../hooks/useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';

import { ethers } from 'ethers';

export const useCToken = () => {

  const { account, chainId } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();

  // Goerli (and other test networks) Dai is fixed address 
  const daiAddress = (chainId === 5) ?  '0x575fb509b5504CB8CE5c0639E60C3d2ac3a7D2Ae' : '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'

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
