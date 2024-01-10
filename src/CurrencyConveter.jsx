import React, { useState, useEffect } from "react";

const calculator = ({ baseCurrency }) => {
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {

      const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
      const data = await response.json();
      setExchangeRate(data.rates.JPY);

    };

    fetchExchangeRate();
  }, [baseCurrency]);

  const convertYen = () => {

    const result = amount * exchangeRate;
    return result.toFixed(2);
  };

  const handleAmountChange = (e) => {
    const inputAmount = parseFloat(e.target.value);

    if (!isNaN(inputAmount)) {
      setAmount(inputAmount);
    } else {
      setAmount(0);
    }

  };

  return (
    <div>
      <h2>計算機（現在のレートをもとに行う）</h2>
      <label>
        任意の数または値段の{baseCurrency}:

        <input type="numnber" value={amount} onChange={handleAmountChange} />
      </label>
      <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace', textAlign: 'center' }}>
        <p>{`${amount} ${baseCurrency} は ${convertYen()}円`}</p>
      </ul>

    </div>
  );
};

export default calculator;
