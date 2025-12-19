import React from "react";
import Logo from "../assets/moralis-logo.svg";
import ETH from "../assets/eth.svg";
import { Link } from "react-router-dom";
import {  useConnect, useConnectors } from 'wagmi'

function Header(props) {

  const { isConnected, address } = props;

  const { connect } = useConnect()
  const connectors = useConnectors()



  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="Moralis Logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={ETH} alt="eth" className="logo" />
          Ethereum
        </div>
        <div className="connectButton" onClick={() => connect({ connector: connectors[0] })}>
          {isConnected ? (
            address.slice(0, 6) + "..." + address.slice(-4)
          ) : (
            "Connect Wallet"
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;