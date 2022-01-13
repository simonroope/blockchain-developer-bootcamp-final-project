import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { useContract } from '../hooks/useContract';
import { useBondMarketAddress } from '../hooks/useBondMarketAddress';

import BondMarket from '../contracts/BondMarket.json';


const IssueBondForm = ({ bondMarketAddress }) => {

  const { active, account, chainId } = useWeb3React();
  const bondMarket = useContract(bondMarketAddress, BondMarket.abi);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [listing, setListing] = useState([]);
  const [values, setValues] = useState({
    bondName: "", bondPrice: "", bondRate: "",
    bondInterval: "", bondDate: "", bondValue: ""
  });

  const onChange = (event) => {

    console.log( "onChange -> " + event.target.name + " : " + event.target.value );

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  const issueBond = async ( name, salePrice, couponRate, couponInterval, daysToMaturity, faceValue ) => {

    try {
      const transaction = await bondMarket.issueBond ( ethers.utils.formatBytes32String(name), ethers.utils.parseEther(salePrice),
                                                       ethers.utils.parseEther(couponRate), couponInterval, daysToMaturity,
                                                       ethers.utils.parseEther(faceValue),
                                                       { from: account } );
      await transaction.wait();
      console.log(`transaction hash: ${transaction.hash}`);
    } catch (e) {
      console.log(`error ${e.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    issueBond(values.bondName, values.bondPrice, values.bondRate, values.bondInterval, values.bondDate, values.bondValue);
    handleClose();

  };

  return (

    <div className="container">

      <Button className="nextButton button-size" onClick={handleShow}>Issue New Bond</Button>

      <Modal show={show} onHide={handleClose} backdrop='static' keyboard="False">

        <Modal.Header closeButton>
          <Modal.Title>Issue New Bond</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} id="issueBondForm">
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondName" placeholder="Enter Bond Name" value={values.bondName} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondPrice" placeholder="Enter Bond Price" value={values.bondPrice} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondRate" placeholder="Enter Bond Coupon Rate" value={values.bondRate} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondInterval" placeholder="Enter Bond Coupon Interval" value={values.bondInterval} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondDate" placeholder="Enter Bond Days to Maturity" value={values.bondDate} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control type="text" name="bondValue" placeholder="Enter Bond Face Value" value={values.bondValue} onChange={onChange} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit" form="issueBondForm">Submit</Button>
        </Modal.Footer>

      </Modal>

    </div>
  );
};


const IssueBondModal = () => {

  const { bondMarketAddress } = useBondMarketAddress();
  if (!bondMarketAddress) return null;

  return <IssueBondForm bondMarketAddress={bondMarketAddress} />;
}

export default IssueBondModal;
