import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import config from '../utils/config';

import BondMarket from '../contracts/BondMarket.json';


export function useBondMarketAddress() {

  const { chainId } = useWeb3React();
  const [bondMarketAddress, setBondMarketAddress] = useState(null);

  useEffect(() => {

    if (chainId) {
      setBondMarketAddress(BondMarket.networks[config.NetworkIdToChainId[chainId]]?.address);
    }
  }, [chainId]);

  return {
    bondMarketAddress,
  };
}
