import React, { useEffect, useState } from "react";
import axios from 'axios';
import Calculator from './CurrencyConveter';

const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';
const API_KEY = 'a6f71f75814d8522c73be49bb53e5135';



async function fetchExchangeRates(baseCurrency) {
    const response = await axios.get(`${EXCHANGE_API_URL}?apikey=${API_KEY}&base=${baseCurrency}`);
    return response.data;
}

export default function App() {
    const [exchangeRates, setExchangeRates] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("USD");
    const [selectedCurrencies, setSelectedCurrencies] = useState(["JPY"]);
    const [rateChangeStatus, setRateChangeStatus] = useState('データなし');


    useEffect(() => {
        const fetchData = async () => {
            const rates = await fetchExchangeRates(selectedCountry);
            const previousRates = getPreviousRates();
            setExchangeRates(rates);
            savePreviousRates(rates);
            if (previousRates) {

                calculateRateChange(selectedCurrencies[0], rates.rates[selectedCurrencies[0]], previousRates.rates[selectedCurrencies[0]]);
            }
        };

        fetchData();
    }, [selectedCountry, selectedCurrencies]);






    const intervalId = setInterval(() => {
        fetchData();
    }, 600000);

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleCurrencyChange = (event) => {
    
        setSelectedCurrencies(selected);
    };

    const calculateRateChange = (currency, currentRate, previousRate) => {
        if (currentRate && previousRate) {
            const rateChange = currentRate - previousRate;

            if (rateChange > 0) {
                setRateChangeStatus(`円安 (${rateChange.toFixed(4)}円上昇)`);

            } else if (rateChange < 0) {
                setRateChangeStatus(`円高 (${Math.abs(rateChange).toFixed(4)}円下落)`);

            }
        }
    };

    const getPreviousRates = () => {
        const previousRatesString = localStorage.getItem('previousRates');

        if (previousRatesString) {
            return JSON.parse(previousRatesString);
        } else {
            return null;
        }
    };

    const savePreviousRates = (rates) => {
        localStorage.removeItem('previousRates');
        localStorage.setItem('previousRates', JSON.stringify(rates));
    };

    return (
        <>
            <header>
                <h1>為替相場</h1>
            </header >

            <div>
                <main>
                    <label htmlFor="countrySelect">国を選択：</label>
                    <select id="countrySelect" value={selectedCountry} onChange={handleCountryChange}>
                        <option value="USD">米ドル (USD)</option>
                        <option value="EUR">ユーロ (EUR)</option>
                        <option value="GBP">ポンド (GBP)</option>
                        <option value="CNY">元 (CNY)</option>
                        <option value="KRW">ウォン (KRW)</option>
                    </select>

                    <p>JPY:円</p>

                    <p>為替相場:</p>
                    {exchangeRates && exchangeRates.rates && (
                        <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace', textAlign: 'center' }}>
                            {selectedCurrencies.map(currency => (
                                <li key={currency} style={{ marginBottom: '10px', fontFamily: 'monospace', fontSize: '24px' }}>
                                    {`${currency}: ${exchangeRates.rates[currency]} (${rateChangeStatus})`}
                                </li>
                            ))}
                        </ul>
                    )}
                    <Calculator baseCurrency={selectedCountry} />


                </main>
                <aside className="aside-container">
                    <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace' }}>

                        <p>注意</p>
                        <p>ここでの円安と円高とは、前のレートと新しく受け取ったレートに対して、上がった下がったかどうかで決めている。

                            ＜例＞ドル: 前:154、後:144　円高（154-144）＝10円下落　10円安くなったとする

                        </p>
                    </ul>

                </aside>
            </div>


            <footer>
                <p>5422050  滝本涼太</p>
                <p>日本大学文理学部情報科学科 Webプログラミングの演習課題</p>
            </footer>
        </>
    );
}
