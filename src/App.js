import React, { Component } from 'react'
import EthereumService from './services/EthereumService'
import QRCode from 'qrcode.react'
import './styles/App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeNavIdent: "wallet",
      walletCreated: false,
      walletPassword: "",
      walletPrivateKey: "",
      walletAddress: ""
    }
  }

  _walletPasswordChange(event) {
    this.setState({ walletPassword: event.target.value })
  }

  _generateWallet() {
    this.setState({
      walletCreated: true,
      walletPrivateKey: `${EthereumService.sha256(this.state.walletPassword)}`,
      walletAddress: `${EthereumService.passwordToAddress(this.state.walletPassword)}`
    })
  }

  render() {
    var AppHeader, AppWrapper, AppNav, AppContent

    AppHeader =
    <div className="App-Header">
      <h1>Eth3r Tools</h1>
    </div>

    AppNav =
    <div className="App-Nav">
      <div className={(this.state.activeNavIdent == "wallet")? "nav-item active" : "nav-item"}
           data-nav-ident="wallet"
           onClick={() => this.setState({activeNavIdent: "wallet"})}>
        <p>Wallet</p>
      </div>
      <div className={(this.state.activeNavIdent == "transactions")? "nav-item active" : "nav-item"}
           data-nav-ident="transactions"
           onClick={() => this.setState({activeNavIdent: "transactions"})}>
        <p>Transactions</p>
      </div>
    </div>

    switch(this.state.activeNavIdent) {
      case "wallet":
        var ContentHeader, Segment2

        ConetentHeader =
        <div className="Content-Header">
          <h1>Create a Wallet</h1>
          <input
            className="wallet-password"
            type="text"
            value={this.state.walletPassword}
            onChange={this._walletPasswordChange.bind(this)} />
          <div
            className="action-button"
            onClick={this._generateWallet.bind(this)}>
            <p>{`Generate Wallet`}</p>
          </div>
        </div>

        if(this.state.walletCreated) {
          Segment2 =
          <div className="Content-Content">
            <div className="private-key">
              <h1>Private Key</h1>
              <p>{this.state.walletPrivateKey}</p>
              <QRCode value={this.state.walletPrivateKey} />
            </div>
            <div className="address">
              <h1>Wallet Address</h1>
              <p>{this.state.walletAddress}</p>
              <QRCode value={this.state.walletAddress} />
            </div>
          </div>
        } else {
          Segment2 =
          <div />
        }

        AppContent =
        <div className="App-Content wallet">
          {ConetentHeader}
          {Segment2}
        </div>
        break;
      case "transactions":
        var ConetentHeader
        ConetentHeader =
        <div className="Content-Header">
          <h1>Create a Transaction</h1>
          <input
            className="wallet-password"
            type="text"
            value={this.state.walletPassword}
            onChange={this._walletPasswordChange.bind(this)} />
          <div
            className="action-button"
            onClick={this._generateWallet.bind(this)}>
            <p>{`Create Transaction`}</p>
          </div>
        </div>

        AppContent =
        <div className="App-Content transaction">
          {ConetentHeader}
        </div>
        break;
      default:
        AppContent =
        <div />
    }

    AppWrapper =
    <div className="App-Wrapper">
      {AppNav}
      {AppContent}
    </div>

    return (
      <div className="App">
        {AppHeader}
        {AppWrapper}
      </div>
    )
  }

}

export default App
