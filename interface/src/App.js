import { bidPostAbi } from './abis/abis';
import React, { useRef, useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0xA74882Cb4FF7E5b91e8b7352384480796D6527aD';
const BidPost = new web3.eth.Contract(bidPostAbi, contractAddr);



export default function App() {
  const [lastBid, setLastBid] = useState();
  const [content, setContent] = useState('Place Bid to post');
  const [paid, setPaid] = useState(false);
  const message = useRef(null);
  const [author, setAuthor] = useState();
  const [bidPrice, setBidPrice] = useState(0);
  const [account, setAccount] = useState(0);
  const [bidAgain, setBidAgain] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(false)
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    async function fetchAccount() {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0]);
      console.log("account "+account)
      // returns in wei
      const result = await BidPost.methods.getLatestBid().call();
      const result1 = web3.utils.fromWei(result, 'Ether')
      console.log(result1);
    }
      // so that when the page is refreshed lastBid stays the same and don't go back to zero.
    async function setLatestBid() {
      const result = await BidPost.methods.getLatestBid().call();
      const result1 = web3.utils.fromWei(result, 'Ether')
      setLastBid(result1)
    }
    // to test function that has only access to owner
    async function resetLastBid() {
      const owner = await BidPost.methods.getOwner().call();
      console.log("owner: "+owner);
      await BidPost.methods.resetLatestBid().call({from: owner});
    }
    async function fetchAuthor() {
      const result = await BidPost.methods.getAuthor().call();
      if(result!='0x0000000000000000000000000000000000000000')
        setAuthor(result);
    }

    async function fetchMessage() {
      const result  = await BidPost.methods.getMessage().call();
      if(result) {
        setContent(result);
      }
    }
    fetchAccount();
    setLatestBid();
    resetLastBid();
    //fetchAuthor();
    //fetchMessage();
  }, [])

  // submit tokens and move to enter a message
  const handleBid = async (e) => {
    e.preventDefault();

    // call placeBid()
    if (bidPrice > 0) {
      await BidPost.methods.placeBid().send({ value: web3.utils.toWei(bidPrice, 'Ether'), from: account });
    // update lasttBid
      const result = await BidPost.methods.getLatestBid().call();
      const result1 = web3.utils.fromWei(result, 'Ether')
      setLastBid(result1)
     // setLastBid(bidPrice);
      // set states
      setPaid(true);
      setBidAgain(false);
      setSubmitMessage(false)
      setAuthor(account);
    }

  }

  // submit message
  const handleContent = async () => {
    if (message.current)
      {
        setContent(message.current.value)
        setSubmitMessage(true);
    }
    else {
      // user must submit a string 
      // have a pop up message that says user must type something into the input field
      // when user clicks submit it doesnt do anything
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Last bid: {lastBid} ETH</p>

        <form onSubmit={handleBid}>

          {/* enter bid */}
          {(!paid || bidAgain) && <input onChange={e => setBidPrice(e.target.value)} type="text" placeholder="enter bid" />}
          {(!paid || bidAgain) && <input type="submit" />}

          {/* submit message */}
          {!submitMessage && paid && !bidAgain && <input ref={message} id="message" type="text" id="user-input" placeholder="type in your message" />}
          {!submitMessage && paid && !bidAgain && <button onClick={handleContent}>Submit</button>}
          
          {/* bid again button */}
          {submitMessage && !bidAgain && 
          <div><br /><button onClick={() => setBidAgain(true)}>bid again</button></div>}

        </form>

        {/* checkbox and label */}
        {!submitMessage && paid && !bidAgain && 
          <div>
            <br />
              <input type="checkbox" onChange={() => setToggle(prev => !prev)} checked/>
              <label>Toggle to show your address as the author of the message</label>
            </div>
        }
        
        {/* content and author */}
        <p>{content}</p>
        {toggle && author && <p>By {author}</p>}
      </header>
    </div>
  );
}

