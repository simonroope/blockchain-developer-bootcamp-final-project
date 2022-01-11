The contracts apply the following measures to avoid common security pitfalls:

* SWC-100 Proper setting of visibility for functions:
external for functions that are only called by externally
public for functions that are called both internally and externally
payable for function that receives ETH payment
internal and private for functions that are used within the contract

* SWC-103 (Floating pragma): Specific compiler pragma 0.8.0 used in contracts to avoid accidental bug inclusion through outdated compiler versions.

* SWC-104 (Unchecked Call Return Value): The return value from a call to the owner's address in BondMarket is checked with require to ensure transaction rollback if the call fails.

* SWC-105 (Unprotected Ether Withdrawal): Withdraw is protected with OpenZeppelin Ownable's onlyOwner modifier.

* SWC-107 (Reentrancy): The Checks-Effects-Interactions pattern is being used in BondMarket.buyBond. State changes are avoided after external calls.

* SWC-115 (tx.origin auth): The contracts use msg.sender.

* Use Modifiers Only for Validation: The modifiers are used only for validation. They do not change state.

* Recommended Use of Require, Assert and Revert. The require, revert and assert are used in a proper way. Require is being used for input validation, revert for further check within a code and assert in the event of unexpected attacks.

* Pull over push. All functions that modify state are based on receiving calls rather than making contract calls.