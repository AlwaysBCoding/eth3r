import ethutil from 'ethereumjs-util'
import cryptoSHA256 from 'crypto-js/sha256'

class EthereumService {

  constructor() {
    this.ethutil = ethutil
  }

  hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  privateKeyToAddress(privateKey) {
    var address = ethutil.privateToAddress(this.hexToBytes(privateKey))
    return `0x${address.toString('hex')}`
  }

  sha256(message) {
    return cryptoSHA256(message)
  }

  passwordToAddress(password) {
    return this.privateKeyToAddress(`${this.sha256(password)}`)
  }

}

module.exports = new EthereumService()
