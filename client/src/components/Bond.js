import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import dayjs from 'dayjs'; 
import { ethers } from 'ethers';

import { useContract } from '../hooks/useContract';
import { useBondMarketAddress } from '../hooks/useBondMarketAddress';

import BondMarket from '../contracts/BondMarket.json';

import { shortAddress } from '../utils/ethAddressUtils';

import { useDaiAddress } from '../hooks/useDaiAddress';
import Dai from '../contracts/Dai.json';

import IssueBondModal from './IssueBondModal';
import ApproveBondModal from './ApproveBondModal';

const BondListing = ({ bondMarketAddress }) => {

  const { account, chainId } = useWeb3React();
  const bondMarket = useContract(bondMarketAddress, BondMarket.abi);
  const [listing, setListing] = useState([]);

  //  const { daiAddress } = useDaiAddress();

  // Rinkeby
  // const daiAddress = '0x918Fd7cc2F6B6528B443B8C3ffAeF025551f3eb3';
  const daiAddress = (chainId) == 4 ? '0x918Fd7cc2F6B6528B443B8C3ffAeF025551f3eb3' : '0xE38d56E19a986bFB3DdaB77D17921Cccac6666F2';

  const dai = useContract(daiAddress, Dai.abi);

  const buyBond = async ( bondId, salePrice ) => {

    try {

      const transaction = await bondMarket.buyBond ( bondId, salePrice, { from: account } );
      await transaction.wait();

    } catch (e) {
      console.log(`error ${e.message}`);
    }

    const listing = await bondMarket.getBonds();
    setListing(listing);
  };

  useEffect(() => {
    const getListing = async () => {
      const listing = await bondMarket.getBonds();
      setListing(listing);
    };
    getListing();
  }, []);

  return (

    <div className="container">

      <div className="card d-flex flex-row justify-content-between bg-body">
        <div className="card-body">
          <h4 className="card-title">All Bonds</h4>
          <div className="row">
            <table className="table table-small table-hover mb-10">
              <thead className="align-top">
                <tr>
                  <th>Issuer</th>
                  <th>Name</th>
                  <th>Sale Price (DAI)</th>
                  <th>Coupon Rate %</th>
                  <th>Coupon Interval</th>
                  <th>Maturity Date</th>
                  <th>Face Value (DAI)</th>
                  <th>Holder</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {listing.map((bond, index) => (
                  <tr key={index}>
                    <td>{shortAddress(bond.issuer)}</td>
                    <td className="text-nowrap">{ethers.utils.parseBytes32String(bond.name)}</td>
                    <td>{ethers.utils.formatEther(bond.salePrice)}</td>
                    <td>{ethers.utils.formatEther(bond.couponRate)}%</td>
                    <td>{Number(bond.couponInterval)} days</td>
                    <td>{dayjs(parseInt(bond.maturityDate)*1000).format('DD/MM/YYYY')}</td>
                    <td>{ethers.utils.formatEther(bond.faceValue)}</td>
                    <td>{shortAddress(bond.holder)}</td>
                    <td><button className={`btn btn-sm ${bond.forSale === true && bond.holder !== account ? 'btn-warning' : 'btn-secondary disabled'}`}
                            onClick={() => buyBond(bond.bondId, bond.salePrice)}>Buy Bond</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  )

};

const Bond = () => {

  const { bondMarketAddress } = useBondMarketAddress();
  if (!bondMarketAddress) return null;

  return (

    <BondListing bondMarketAddress={bondMarketAddress} />

  );

};

export default Bond;
