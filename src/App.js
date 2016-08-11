import React, { Component } from 'react'
import EthereumService from './services/EthereumService'
import QRCode from 'qrcode.react'
import _ from 'lodash'
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
      walletGenSalt: ""
    }
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
    var AppHeader, AppWrapper, AppNav, AppContent

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
    </div>

    switch(this.state.activeNavIdent) {
      case "wallet":
        var ContentHeader, ContentContent, InputSourcesPanel, WalletGenInfo

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
      case "transactions":
        ContentHeader =
        <div className="Content-Header">
          <h2>Create a Transaction</h2>
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
          {ContentHeader}
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
