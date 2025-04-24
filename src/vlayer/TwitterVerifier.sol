// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

import {TwitterProver} from "./TwitterProver.sol";

contract TwitterVerifier is Verifier {
    address public prover;

    mapping(string => int256) public usernameToFollowersCount;

    constructor(address _prover) {
        prover = _prover;
    }

    function verify(Proof calldata, string memory _username, int256 _followersCount) public onlyVerified(prover, TwitterProver.main.selector) {
        usernameToFollowersCount[_username] = _followersCount;
    }
}
