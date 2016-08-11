import React, { Component } from 'react'
import EthereumService from './services/EthereumService'
import QRCode from 'qrcode.react'
import Q from 'q'
// import _ from 'lodash'
import './styles/App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeNavIdent: "wallet",
      activeContentHeaderNavIdent: "from-passphrase",
      walletCreated: false,
      walletPassword: "",
      walletSalt: "",
      walletPrivateKey: "",
      walletAddress: "",
      walletGenPassword: "",
      walletGenSalt: "",
      fromPrivateKey: "",
      amount: 0,
      toAddress: ""
    }
  }

  _sendEther({fromPrivateKey, toAddress, amount}) {
    var endpoint1 = `https://api.blockcypher.com/v1/eth/main/txs/new?token=2ea49eb351bf445e97a49f5ffd2f7a01`
    var endpoint2 = `https://api.blockcypher.com/v1/eth/main/txs/send?token=2ea49eb351bf445e97a49f5ffd2f7a01`
    var deferred = Q.defer()
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var apiData1 = {
      "inputs": [
        {
          "addresses": [EthereumService.privateKeyToAddress(fromPrivateKey)]
        }
      ],
      "outputs": [
        {
          "addresses": [toAddress],
          "value": amount
        }
      ]
    }

    var fetchConfig1 = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(apiData1)
    }

    fetch(endpoint1, fetchConfig1)
      .then((response) => response.json())
      .then((data) => {
        var signature = EthereumService.signMessage({
          privateKey: fromPrivateKey,
          messageHash: data.tosign[0]
        })
        // console.log(data.tosign[0])
        // console.log(signature)
        data.signatures = [signature]
        // console.log(data)
        return data
      })
      .then((apiData2) => {
        var fetchConfig2 = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(apiData2)
        }

        return fetch(endpoint2, fetchConfig2)
      })
      .then((response) => response.json())
      .then((data) => {
        // console.log("CHECKPOINT")
        // console.log(data)
      })
      .catch((error) => { deferred.reject(error) })

    return deferred
  }

  _walletPasswordChange(event) {
    this.setState({ walletPassword: event.target.value })
  }

  _generateWallet({salt, privateKey, random}) {
    var passwordToken
    if(random) {
      passwordToken = `Eth3r${Date.now()}`
    } else if (salt) {
      passwordToken = this.state.walletPassword + salt
    } else {
      passwordToken = this.state.walletPassword
    }

    if(privateKey) {
      this.setState({
        walletCreated: true,
        walletPassword: "",
        walletPrivateKey: privateKey,
        walletAddress: `${EthereumService.privateKeyToAddress(privateKey)}`,
      })
    } else {
      this.setState({
        walletCreated: true,
        walletPrivateKey: `${EthereumService.sha256(passwordToken)}`,
        walletAddress: `${EthereumService.passwordToAddress(passwordToken)}`,
        walletPassword: "",
        walletGenPassword: this.state.walletPassword,
        walletGenSalt: salt
      })
    }
  }

  _clearWallet() {
    this.setState({
      walletCreated: false,
      walletGenPassword: null,
      walletGenSalt: null,
      walletPassword: "",
    })
  }

  _navigateToContentHeader(navIdent) {
    this._clearWallet()
    this.setState({
      activeContentHeaderNavIdent: navIdent
    })
  }

  render() {
    EthereumService.signMessage({
      privateKey: "47f87540d75417c3e4f2a4f0600a1c04679a29183aa8d4c37f94e2b4a1b6b0b8",
      messageHash: "d31e9576370cc19a221cc95ee17fea892601ea00188d5a8cee0197b9dde67de1"
    })

    var AppHeader, AppWrapper, AppNav, AppContent
    var ContentHeader, ContentContent, InputSourcesPanel, WalletGenInfo

    AppHeader =
    <div className="App-Header">
      <h1>Eth3r Tools</h1>
    </div>

    AppNav =
    <div className="App-Nav">
      <div className={(this.state.activeNavIdent === "wallet")? "nav-item active" : "nav-item"}
           data-nav-ident="wallet"
           onClick={() => this.setState({activeNavIdent: "wallet"})}>
        <p>Wallet</p>
      </div>
      <div className={(this.state.activeNavIdent === "transactions")? "nav-item active" : "nav-item"}
           data-nav-ident="transactions"
           onClick={() => this.setState({activeNavIdent: "transactions"})}>
        <p>Transactions</p>
      </div>
      <div className={(this.state.activeNavIdent === "conversions")? "nav-item active" : "nav-item"}
           data-nav-ident="conversions"
           onClick={() => this.setState({activeNavIdent: "conversions"})}>
        <p>Conversions</p>
      </div>
    </div>

    switch(this.state.activeNavIdent) {
      // WALLET
      case "wallet":
        ContentHeader =
        <div className="Content-Header">
          <h2>Create a Wallet</h2>
          <div className="flex-spacer" />
          <div className="Content-Header-Nav">
            <div className={(this.state.activeContentHeaderNavIdent === "from-passphrase") ? "content-header-nav-item active" : "content-header-nav-item"}
                 data-nav-ident="from-passphrase"
                 onClick={this._navigateToContentHeader.bind(this, "from-passphrase")}>
              <p>From Static Passphrase</p>
            </div>
            <div className={(this.state.activeContentHeaderNavIdent === "from-passphrase-salt") ? "content-header-nav-item active" : "content-header-nav-item"}
                  data-nav-ident="from-passphrase-salt"
                  onClick={this._navigateToContentHeader.bind(this, "from-passphrase-salt")}>
              <p>From Passphrase with Salt</p>
            </div>
            <div className={(this.state.activeContentHeaderNavIdent === "from-private-key") ? "content-header-nav-item active" : "content-header-nav-item"}
                  data-nav-ident="from-private-key"
                  onClick={this._navigateToContentHeader.bind(this, "from-private-key")}>
              <p>From Private Key</p>
            </div>
            <div className={(this.state.activeContentHeaderNavIdent === "random") ? "content-header-nav-item active" : "content-header-nav-item"}
                  data-nav-ident="random"
                  onClick={this._navigateToContentHeader.bind(this, "random")}>
              <p>Random</p>
            </div>
          </div>
        </div>

        if(this.state.walletCreated) {
          if(this.state.walletGenPassword && this.state.walletGenSalt) {
            WalletGenInfo =
            <div className="wallet-gen-info">
              <p>{`Passphrase: ${this.state.walletGenPassword}`}</p>
              <p>{`Salt: ${this.state.walletGenSalt}`}</p>
            </div>
          } else if(this.state.walletGenPassword) {
            WalletGenInfo =
            <div className="wallet-gen-info">
              <p>{`Passphrase: ${this.state.walletGenPassword}`}</p>
            </div>
          } else {
            WalletGenInfo =
            <div />
          }
        } else {
          WalletGenInfo =
          <div />
        }

        switch(this.state.activeContentHeaderNavIdent) {
          case "from-passphrase":
            InputSourcesPanel =
            <div className="panels-column">
              <div className="panel input-sources">
                <input
                  className="wallet-password"
                  type="text"
                  placeholder="Passphrase..."
                  value={this.state.walletPassword}
                  onChange={this._walletPasswordChange.bind(this)} />
              </div>
              <div className="panel input-sources-actions">
                {WalletGenInfo}
                <div className="flex-spacer" />
                <div
                  className="action-button"
                  onClick={this._generateWallet.bind(this, {})}>
                  <p>{`Generate Wallet`}</p>
                  </div>
              </div>
            </div>
            break;
          case "from-passphrase-salt":
            InputSourcesPanel =
            <div className="panels-column">
              <div className="panel input-sources">
                <input
                  className="wallet-password"
                  type="text"
                  placeholder="Passphrase..."
                  value={this.state.walletPassword}
                  onChange={this._walletPasswordChange.bind(this)} />
              </div>
              <div className="panel input-sources-actions">
                {WalletGenInfo}
                <div className="flex-spacer" />
                <div
                  className="action-button"
                  onClick={this._generateWallet.bind(this, {salt: String(Date.now())})}>
                  <p>{`Generate Wallet`}</p>
                  </div>
              </div>
            </div>
            break;
          case "from-private-key":
            InputSourcesPanel =
            <div className="panels-column">
              <div className="panel input-sources">
                <input
                  className="wallet-password"
                  type="text"
                  placeholder="Private Key..."
                  value={this.state.walletPassword}
                  onChange={this._walletPasswordChange.bind(this)} />
              </div>
              <div className="panel input-sources-actions">
                {WalletGenInfo}
                <div className="flex-spacer" />
                <div
                  className="action-button"
                  onClick={this._generateWallet.bind(this, {privateKey: this.state.walletPassword})}>
                  <p>{`Generate Wallet`}</p>
                  </div>
              </div>
            </div>
            break;
          case "random":
          InputSourcesPanel =
            <div className="panels-column">
              <div className="panel input-sources">
                <p>COMPLETELY RANDOM</p>
              </div>
              <div className="panel input-sources-actions">
                {WalletGenInfo}
                <div className="flex-spacer" />
                <div
                  className="action-button"
                  onClick={this._generateWallet.bind(this, {random: true})}>
                  <p>{`Generate Wallet`}</p>
                </div>
              </div>
            </div>
            break;
          default:
          InputSourcesPanel =
          <div className="panel input-sources">
          </div>
        }

        if(this.state.walletCreated) {
          ContentContent =
          <div className="Content-Content">
            {InputSourcesPanel}
            <div className="panels-row">
              <div className="panel private-key">
                <div className="panel-header">
                  <h3>Private Key</h3>
                </div>
                <div className="panel-content">
                  <p className="ether-key">{this.state.walletPrivateKey}</p>
                  <QRCode
                    value={this.state.walletPrivateKey}
                    className="wallet-qr-code"
                    size={150} />
                </div>
              </div>
              <div className="panel address">
                <div className="panel-header">
                  <h3>Wallet Address</h3>
                </div>
                <div className="panel-content">
                  <p className="ether-key">{this.state.walletAddress}</p>
                  <QRCode
                    value={this.state.walletAddress}
                    className="wallet-qr-code"
                    size={150} />
                </div>
              </div>
            </div>
          </div>
        } else {
          ContentContent =
          <div className="Content-Content">
            {InputSourcesPanel}
          </div>
        }

        AppContent =
        <div className="App-Content wallet">
          {ContentHeader}
          {ContentContent}
        </div>
        break;

      // TRANSACTIONS
      case "transactions":
        ContentHeader =
        <div className="Content-Header">
          <h2>Create a Transaction</h2>
        </div>

        InputSourcesPanel =
        <div className="panels-column">
          <div className="panel input-sources">
            <input
              className="from-private-key"
              type="text"
              placeholder="From Private Key..."
              value={this.state.fromPrivateKey}
              onChange={(event) => this.setState({ fromPrivateKey: event.target.value })} />
            <div className="flex-spacer" />
            <input
              className="amount"
              type="text"
              placeholder="Amount..."
              value={this.state.amount}
              onChange={(event) => this.setState({ amount: parseInt(event.target.value, 10) })} />
            <div className="flex-spacer" />
            <input
              className="to-address"
              type="text"
              placeholder="To Address..."
              value={this.state.toAddress}
              onChange={(event) => this.setState({ toAddress: event.target.value })} />
          </div>
          <div className="panel input-sources-actions">
            <div className="flex-spacer" />
            <div
              className="action-button"
              onClick={() => this._sendEther({fromPrivateKey: this.state.fromPrivateKey,
                                              toAddress: this.state.toAddress,
                                              amount: this.state.amount})}>
              <p>{`Send Ether`}</p>
              </div>
          </div>
        </div>

        ContentContent =
        <div className="Content-Content">
          {InputSourcesPanel}
        </div>

        AppContent =
        <div className="App-Content transactions">
          {ContentHeader}
          {ContentContent}
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
