import React, { Component } from 'react'
import EthereumService from './services/EthereumService'
import QRCode from 'qrcode.react'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
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
    var AppHeader, AppContent

    AppHeader =
    <div className="App-Header">
      <h1>Eth3r Wallet</h1>
      <input
        className="wallet-password"
        type="text"
        value={this.state.walletPassword}
        onChange={this._walletPasswordChange.bind(this)} />
      <div
        className="generate-wallet"
        onClick={this._generateWallet.bind(this)}>
        <p>{`Generate Wallet`}</p>
      </div>
    </div>

    if(this.state.walletCreated) {
      AppContent =
      <div className="App-Content">
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
      AppContent =
      <div />
    }

    return (
      <div className="App">
        {AppHeader}
        {AppContent}
      </div>
    )
  }

}

export default App
