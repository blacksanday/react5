import React, { useEffect, useState } from "react";
import axios from 'axios';

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

    useEffect(() => {
        (async () => {

            const rates = await fetchExchangeRates(selectedCountry);
            console.log('Exchange Rates:', rates);
            setExchangeRates(rates);
        })();

    }, [selectedCountry]);

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        const selected = Array.from(event.target.options)
            .filter(option => option.selected)
            .map(option => option.value);
        setSelectedCurrencies(selected);
    };

    return (
        <>
            <header>
                <h1>為替相場</h1>
            </header>
            <div>
                <main>
                    <label htmlFor="countrySelect">国を選択：</label>
                    <select id="countrySelect" value={selectedCountry} onChange={handleCountryChange}>
                        <option value="USD">米ドル (USD)</option>
                        <option value="EUR">ユーロ (EUR)</option>
                        <option value="JPY">日本円 (JPY)</option>
                       
                    </select>

                    <label htmlFor="currencySelect">通貨を選択：</label>
                    <select id="currencySelect" multiple value={selectedCurrencies} onChange={handleCurrencyChange}>
                        <option value="USD">米ドル (USD)</option>
                        <option value="EUR">ユーロ (EUR)</option>
                        <option value="JPY">日本円 (JPY)</option>
                        
                    </select>
                    <p>為替相場:</p>
                    {exchangeRates && exchangeRates.rates && (
                        <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace', textAlign: 'center'}}>
                            {selectedCurrencies.map(currency => (
                                <li key={currency} style={{ marginBottom: '10px', fontFamily: 'monospace', fontSize: '24px' }}>{`${currency}: ${exchangeRates.rates[currency]}`}</li>
                            ))}
                        </ul>
                    )}
                </main>

            </div >
            <footer>
             <p>5422050  滝本涼太</p>
             <p>日本大学文理学部情報科学科 Webプログラミングの演習課題</p>
            </footer>
        </>
    );
}
