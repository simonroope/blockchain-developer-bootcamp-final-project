import React from 'react';
import IssueBondModal from './IssueBondModal';
import ApproveBondModal from './ApproveBondModal';

const BondOptions = () => {

  return (

  <div className="container py-2">

    <div className="d-flex justify-content-center">
      <div>
        <IssueBondModal />
      </div>
      <div>
        <ApproveBondModal />
      </div>
    </div>

  </div> 

  );
};

export default BondOptions;
