const dotenv = require('dotenv');

dotenv.config();
const mnemonic = process.env.MNEMONIC
const rpcEndpoint = process.env.RPC_ENDPOINT

const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing')
const { assertIsBroadcastTxSuccess, SigningStargateClient, GasPrice } = require('@cosmjs/stargate')

const sendToken = async function (recipient) {
  const walletOptions = { prefix: 'game' }
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, walletOptions)
  const [firstAccount] = await wallet.getAccounts()
  if(firstAccount.address == recipient){
      return ''
  }

  const gasPrice = GasPrice.fromString('0.025ugame')
  const gasLimits = {
    send: 100000
  }
  const options = { gasPrice: gasPrice, gasLimits: gasLimits }
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, options)

  const amount = {
    denom: 'ugame',
    amount: '20'
  }

  const result = await client.sendTokens(firstAccount.address, recipient, [amount], 'Spam send')
  assertIsBroadcastTxSuccess(result)
  console.log(result)
  return result
}

const main = async () => {
    const arr = ["game1ml8a67e3quj6dg8ldj0ays4zx4fv85sgmcevck", "game1487tpq3n2xdjtuw9wewjt3vxhpsgfke29ecglf", "game1xfcyg8t40nwv4qt265gj9ffaxmfesqjgtl3l79"]
    for (const element of arr) {
        await sendToken(element)
    }
}

const loopMain = async () => {
  while (true) {
      await main()
  }
}

loopMain()
