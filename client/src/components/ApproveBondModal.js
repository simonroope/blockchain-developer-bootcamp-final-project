import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { useContract } from '../hooks/useContract';

import { useBondMarketAddress } from '../hooks/useBondMarketAddress';
import BondMarket from '../contracts/BondMarket.json';

import { useBondTokenAddress } from '../hooks/useBondTokenAddress';
import BondToken from '../contracts/BondToken.json';


const ApproveBondForm = ({ bondTokenAddress, bondMarketAddress }) => {

  const { active, account, chainId } = useWeb3React();
  const bondToken = useContract(bondTokenAddress, BondToken.abi);
  const bondMarket = useContract(bondMarketAddress, BondMarket.abi);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [listing, setListing] = useState([]);
  const [values, setValues] = useState({ bondId: "", bondPrice: "" });

  const onChange = (event) => {

    console.log( "onChange -> " + event.target.name + " : " + event.target.value );

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const approveBond = async ( id, salePrice ) => {

    try {

      const transaction = await bondToken.setApprovalForAll(bondMarket.address, true, {from: account} );
      await transaction.wait();

      const isApproved2 = await bondToken.isApprovedForAll(account,bondMarket.address);

    } catch (e) {
      console.log(`error ${e.message}`);
    }

    const listing = await bondMarket.getBonds();
    setListing(listing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    approveBond(values.bondId, values.bondPrice);
    handleClose();
  };

  return (

    <div className="container">

      <Button className="nextButton button-size" onClick={handleShow}>Approve Bonds for Sale</Button>

      <Modal show={show} onHide={handleClose} backdrop='static' keyboard="False">

        <Modal.Header closeButton>
          <Modal.Title>Approve Bonds for Sale</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} id="approveBondForm"></Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit" form="approveBondForm">Submit</Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
};


const ApproveBondModal = () => {

  const { bondTokenAddress } = useBondTokenAddress();
  const { bondMarketAddress } = useBondMarketAddress();
  if (!bondTokenAddress) return null;

  return <ApproveBondForm bondTokenAddress={bondTokenAddress} bondMarketAddress={bondMarketAddress} />;
}

export default ApproveBondModal;
