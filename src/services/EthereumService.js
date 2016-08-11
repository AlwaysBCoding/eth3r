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

  signMessage({privateKey, messageHash}) {
    var signedMessage = ethutil.ecsign(new Buffer(messageHash, 'hex'), new Buffer(privateKey, 'hex'))
    return ethutil.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString('hex').substring(2, 10000)
  }

}

module.exports = new EthereumService()

// PRIVATE KEY
// 47f87540d75417c3e4f2a4f0600a1c04679a29183aa8d4c37f94e2b4a1b6b0b8

// AMOUNT
// 50000000000000000

// TO ADDRESS
// 0x9da53ebc96d223d8ddc3598ac36f410e47897f57

// HASH TO SIGN
// "d31e9576370cc19a221cc95ee17fea892601ea00188d5a8cee0197b9dde67de1"
