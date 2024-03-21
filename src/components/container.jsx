import { useEffect, useState } from "react"
import { GrCycle } from "react-icons/gr";

const Container = () => {
    const [flagGuess, setFlagGuess] = useState('');
    const [resultMsg, setResultMsg] = useState('');
    const [flagData, setFlagData] = useState({ img: '', name: '' });
    const [resultColor, setResultColor] = useState('');

    const handleInput = (e) =>{
        setFlagGuess(e.target.value);
    }   

    const fetchRandomFlag = () => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                const flagUrl = data[randomIndex].flags.png;
                const countryName = data[randomIndex].name.common;

                console.log("Fetched Flag URL:", flagUrl);
                console.log("Country Name:", countryName);

                setFlagData({ img: flagUrl, name: countryName });
            })
        .catch(error => console.log('Error fetching data: ', error));
    }

    const checkGuess = ()=> {
        const userGuess = flagGuess.trim().toLowerCase();
        const correctAnswer = flagData.name.toLowerCase();

        if (userGuess === correctAnswer) {
            setResultMsg('Correct!');
            setResultColor('text-green-700');
        } else {
            setResultMsg('Incorrect. Try again.');
            setResultColor('text-red-700');
        }
        setTimeout(() => {
            setFlagGuess('');
            setResultMsg('');
            fetchRandomFlag();
        }, 2000);
    }

    useEffect(()=>{
        fetchRandomFlag();
    }, [])
  return (
    <section className="md:w-1/3 w-full h-auto p-4 shadow-2xl shadow-black rounded-2xl">
        <div className="w-full h-auto p-3 flex items-center justify-center">
            <p className="text-cyan-900 font-bold md:text-4xl text-2xl">GUESS THE FLAG</p>
        </div>
        <div className="w-full h-auto flex items-center justify-center py-5">
            <img src={flagData.img} alt="flag" className="w-18 h-18"/>
        </div>
        <form action="" onSubmit={(e)=>{e.preventDefault(); checkGuess();}} className="w-full h-auto p-2 text-center">
            <p className={`${resultColor} font-semibold text-xl`}>{resultMsg}</p>
            <input type="text" onChange={handleInput} required value={flagGuess} placeholder="Enter the Flag Name" className="w-4/5 p-2 bg-transparent outline-0 border-b-2 border-black placeholder-black md:text-2xl text-lg "/>
            <button type="submit" className="w-4/5 text-2xl text-white font-semibold py-3 my-2 bg-cyan-800 rounded-2xl">Submit</button>
        </form>
        <div className="w-full py-2 flex items-center justify-center">
            <button onClick={fetchRandomFlag} className="w-3/5 flex items-center justify-center text-2xl text-white font-semibold py-3 bg-cyan-600 rounded-2xl"><GrCycle size={30} /></button>
        </div>
    </section>
  )
}

export default Container