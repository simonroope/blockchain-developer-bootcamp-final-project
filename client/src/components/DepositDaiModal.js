import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { useCToken } from '../hooks/useCToken';

import { useContract } from '../hooks/useContract';

import { useDaiAddress } from '../hooks/useDaiAddress';
import Dai from '../contracts/Dai.json';

import { useBondMarketAddress } from '../hooks/useBondMarketAddress';
import BondMarket from '../contracts/BondMarket.json';

const DepositDaiForm = ({ daiAddress, bondMarketAddress }) => {

  const { active, account, chainId } = useWeb3React();

  const dai = useContract(daiAddress, Dai.abi);
  const bondMarket = useContract(bondMarketAddress, BondMarket.abi);

  const { fetchCTokenBalance, cTokenBalance, deposit } = useCToken();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [listing, setListing] = useState([]);
  const [values, setValues] = useState({ daiAmount: "" });

  const onChange = (event) => {

    console.log( "onChange -> " + event.target.name + " : " + event.target.value );

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const depositDai = async ( amount ) => {

    try {

      const txnMint = await dai.mint(account,ethers.utils.parseEther(amount.toString()));
      await txnMint.wait(1);

      dai.approve( bondMarket.address, ethers.utils.parseEther(amount.toString()), {from: account});

    } catch (e) {
      console.log(`error ${e.message}`);
    }

    fetchCTokenBalance();

  };

  const handleSubmit = (e) => {

    e.preventDefault();
    depositDai(values.daiAmount);
    handleClose();
  };

  return (

    <div className="container">

      <div className="d-flex justify-content-center my-2">

      <Button className="nextButton" onClick={handleShow}>Deposit DAI</Button>

      </div>

      <Modal show={show} onHide={handleClose} backdrop='static' keyboard="False">

        <Modal.Header closeButton>
          <Modal.Title>Deposit and Approve Dai</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} id="depositDaiForm">
            <Form.Group className="mb-1">
              <Form.Control type="text" name="daiAmount" placeholder="Enter Dai Amount" value={values.daiAmount} onChange={onChange} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit" form="depositDaiForm">Submit</Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
};


const DepositDaiModal = () => {

  const { daiAddress } = useDaiAddress();
  const { bondMarketAddress } = useBondMarketAddress();

  if (!bondMarketAddress) return null;

  return <DepositDaiForm daiAddress={daiAddress} bondMarketAddress={bondMarketAddress} />;
}

export default DepositDaiModal;
