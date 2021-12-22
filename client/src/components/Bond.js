import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import dayjs from 'dayjs'; 
import { ethers } from 'ethers';

import { useContract } from '../hooks/useContract';
import { useBondMarketAddress } from '../hooks/useBondMarketAddress';

import { shortAddress } from '../utils/ethAddressUtils';

import BondMarket from '../contracts/BondMarket.json';

const BondListing = ({ bondMarketAddress }) => {

  const { active, account, chainId } = useWeb3React();
  const bondMarket = useContract(bondMarketAddress, BondMarket.abi);
  const [listing, setListing] = useState([]);


  useEffect(() => {
    const getListing = async () => {
      const listing = await bondMarket.getBonds();
      setListing(listing);
    };
    getListing();
  }, []);

  return (

    <>

    <div className="container">
      <div className="card d-flex flex-row justify-content-between bg-body">
        <div className="card-body">
          <h2 className="card-title">All Bonds</h2>
          <div className="row">
            <table className='table table-small table-hover mb-10'>
              <thead className="align-top">
                <tr>
                  <th>Issuer</th>
                  <th>Name</th>
                  <th>Sale Price</th>
                  <th>Coupon Rate %</th>
                  <th>Coupon Interval</th>
                  <th>Maturity Date</th>
                  <th>Face Value</th>
                  <th>For Sale</th>
                  <th>Holder</th>
                </tr>
              </thead>
              <tbody>
                {listing.map((bond, index) => (
                  <tr key={index}>
                    <td>{shortAddress(bond.issuer)}</td>
                    <td>{ethers.utils.parseBytes32String(bond.name)}</td>
                    <td>{Number(bond.salePrice)}</td>
                    <td>{Number(bond.couponRate)}%</td>
                    <td>{Number(bond.couponInterval)} days</td>
                    <td>{dayjs(parseInt(bond.maturityDate)*1000).format('DD/MM/YYYY')}</td>
                    <td>{Number(bond.faceValue)}</td>
                    <td>{Number(bond.forSale)}</td>
                    <td>{shortAddress(bond.holder)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    </>

  )

};

const Bond = () => {

  const { bondMarketAddress } = useBondMarketAddress();
  if (!bondMarketAddress) return null;

  return <BondListing bondMarketAddress={bondMarketAddress} />;

};

export default Bond;
