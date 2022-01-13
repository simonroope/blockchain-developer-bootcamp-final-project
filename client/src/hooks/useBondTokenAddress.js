import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import config from '../utils/config';

import BondToken from '../contracts/BondToken.json';


export function useBondTokenAddress() {

  const { chainId } = useWeb3React();
  const [bondTokenAddress, setBondTokenAddress] = useState(null);

  useEffect(() => {

    if (chainId) {
      setBondTokenAddress(BondToken.networks[config.NetworkIdToChainId[chainId]]?.address);
    }
  }, [chainId]);

  return {
    bondTokenAddress,
  };
}
