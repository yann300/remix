var React = require('react');
var style = require('./basicStyles')

module.exports = React.createClass({
	propTypes: {
		onNewTxRequested: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {blockNumber: "1382256", blockHash: "", txNumber: "1", from: "", to: "", hash: ""}
	},

	submit: function()
	{
		console.log("request: " + this.state.blockNumber + " " + this.state.txNumber)
		var tx = web3.eth.getTransactionFromBlock(this.state.blockNumber, this.state.txNumber)
		console.log(JSON.stringify(tx))
		if (tx)
		{
			this.setState({from: tx.from, to: tx.to, hash: tx.hash, blockHash: tx.blockHash})
			this.props.onNewTxRequested(this.state.blockNumber, parseInt(this.state.txNumber))
		}
		else
			alert('transaction not found')
	},
	
	updateBlockN: function(ev) {
		this.state.blockNumber = ev.target.value;
	},
	
	updateTxN: function(ev) {
		this.state.txNumber = ev.target.value;
	},

	render: function() {		
		return (
			<div style={style.container} >
			<input onChange={this.updateBlockN} type="text" placeholder= "(default 1382256)"></input>
			<input onChange={this.updateTxN} type="text" placeholder="(default 1)"></input>
			<button onClick={this.submit}>Get</button>
			<div style={style.transactionInfo}>
			<div>Block Hash: {this.state.blockHash}</div>
			<div>Tx Hash: {this.state.hash}</div>
			<div>From: {this.state.from}</div>
			<div>To: {this.state.to}</div>
			</div>
			</div>
			);
	}
})
