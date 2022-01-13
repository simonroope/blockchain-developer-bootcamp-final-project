import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import config from '../utils/config';

import Dai from '../contracts/Dai.json';


export function useDaiAddress() {

  const { chainId } = useWeb3React();
  const [daiAddress, setDaiAddress] = useState(null);

  useEffect(() => {

    if (chainId) {
      setDaiAddress(Dai.networks[config.NetworkIdToChainId[chainId]]?.address);
    }
  }, [chainId]);

  return {
    daiAddress,
  };
}
