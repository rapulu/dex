import React, {useState, useEffect} from 'react'
import { Input, Popover, Radio, Modal, message } from 'antd'
import { DownOutlined, SettingOutlined, ArrowDownOutlined } from '@ant-design/icons'
import tokenList from "../tokenList.json"
import axios from 'axios';

function Swap() {

  const [slippage, setSlippage] = useState("2.5");
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(1);
  const [prices, setPrices] = useState(null);

  const handleSlippageChange = (e) => {
    setSlippage(e.target.value);
  }

  const changeAmount = (e) => {
    const value = e.target.value;
    setTokenOneAmount(value);
    if (value && prices) {
      setTokenTwoAmount(value * prices.data.ratio).toFixed(2);
    } else {
      setTokenTwoAmount(null);
    }
  }

  const switchTokens = () => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);

    const tempToken = tokenOne;
    setTokenOne(tokenTwo);
    setTokenTwo(tempToken);

    fetchTokenPrices(tokenTwo.address, tokenOne.address);
  }

  const openModal = (tokenNumber) => {
    setSelectedToken(tokenNumber);
    setIsOpen(true);
  }

  async function fetchTokenPrices(one, two) {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/token-prices`, {
        params: {
          addressone: one,
          addresstwo: two
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setPrices(response.data);
      console.log("Fetched Prices:", response.data);
    } catch (error) {
      message.error("Failed to fetch token prices");
      return null;
    }
  }

  useEffect(() => {
    fetchTokenPrices(tokenOne.address, tokenTwo.address);
  }, [tokenOne, tokenTwo]);

  const SettingsContent = (
    <div>
      <div>Slipage tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value="0.5">0.5%</Radio.Button>
          <Radio.Button value="2.5">2.5%</Radio.Button>
          <Radio.Button value="5">5%</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        open={isOpen}
        title="Select a token"
        onCancel={() => setIsOpen(false)}
        footer={null}
      > 
        <div className='modalContent'>
          {tokenList.map((token, i) => (
            <div 
              key={i} 
              className='tokenChoice' 
              onClick={() => {
                setPrices(null);
                setTokenOneAmount(null);
                setTokenTwoAmount(null);

                if (selectedToken === 1) {
                  setTokenOne(token);
                  fetchTokenPrices(token.address, tokenTwo.address);
                } else {
                  setTokenTwo(token);
                  fetchTokenPrices(tokenOne.address, token.address);
                }
                setIsOpen(false);
              }}
            >
              <img src={token.img} alt={token.ticker} className='tokenLogo' />
              <div className='tokenChoiceName'>
                <div className='tokenName'>{token.name}</div>
                <div className='tokenTicker'>{token.ticker}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <div className='tradeBox'>
        <div className='tradeBoxHeader'>
          <h4>Swap</h4>
          <Popover
            content={SettingsContent}
            title='Settings'
            placement='bottomRight'
            trigger='click'
          >
            <SettingOutlined className='cog' />
          </Popover>
        </div>
        <div className='inputs'>
          <Input placeholder='0' value={tokenOneAmount} onChange={changeAmount}  disabled={!prices} />
          <Input placeholder='0' value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className='switchArrow'/>
          </div>
          <div className='assetOne' onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt='assetOneLogo' className='assetLogo' />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className='assetTwo' onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt='assetTwoLogo' className='assetLogo' />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div className='swapButton' disabled={!tokenOneAmount}>Swap</div>
      </div>
    </>
  );
}

export default Swap;