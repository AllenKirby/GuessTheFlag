import { useEffect, useState } from "react"
import { HiOutlineLightBulb } from "react-icons/hi";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = () => {
    const [flagGuess, setFlagGuess] = useState('');
    const [flagData, setFlagData] = useState({ img: '', name: '' });
    const [hint, setHint] = useState({region: '', capital: ''});
    const [showHint, setShowHint] = useState(false);
    const [count, setCount] = useState(1);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState({maskedWord: '', whenWrongAnswer: ''});

    const correct = () => {
        toast.success("Correct, Good Job!", {
            position: "top-center",
            pauseOnHover: false,
            autoClose: 2000
        });
    };

    const incorrect = () => {
        toast.error("Incorrect. Try again.", {
            position: "top-center",
            pauseOnHover: false,
            autoClose: 2000
        });
    };

    const gameover = () => {
        toast.error("Game Over, Better Luck Next Time", {
            position: "top-center",
            pauseOnHover: false,
            autoClose: 2000
        });
    };

    const handleInput = (e) =>{
        setFlagGuess(e.target.value);
    }   

    const showhint = () => setShowHint(!showHint);

    const maskWord = (word) => {
        let characters = word.split('');
    
        for (let i = 1; i < characters.length - 1; i++) {
            if (characters[i] !== ' ' && Math.random() < 0.5) {
                characters[i] = '_';
            }
        }
        return characters.join('');
    }

    const fetchRandomFlag = () => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                const flagUrl = data[randomIndex].flags.png;
                const countryName = data[randomIndex].name.common;
                const region = data[randomIndex].region
                const capital = data[randomIndex].capital

                console.log("Fetched Flag URL:", flagUrl);
                console.log("Country Name:", countryName);

                setAnswer({maskedWord: maskWord(countryName)})
                setFlagData({ img: flagUrl, name: countryName });
                setHint({region: region, capital: capital})
                setShowHint(false)

            })
        .catch(error => console.log('Error fetching data: ', error));
    }

    const checkGuess = ()=> {
        const userGuess = flagGuess.trim().toLowerCase();
        const correctAnswer = flagData.name.toLowerCase();

        if (userGuess === correctAnswer) {
            correct();
            setTimeout(() => {
                setScore(prevScore => prevScore + 100);
                setCount(1)
                setFlagGuess('');
                fetchRandomFlag();
            }, 3000);
        } 
        else {
            setFlagGuess('');
            setCount(prevCount => {
                const updatedCount = prevCount + 1;
                if (updatedCount === 4) {
                    gameover();
                    setAnswer({whenWrongAnswer: flagData.name})
                    setTimeout(() => {
                        setCount(1);
                        setFlagGuess('');
                        setAnswer('')
                        fetchRandomFlag();
                    }, 3000);
                }
                else{
                    incorrect();
                    return updatedCount;
                }
            });
        }
    }

    useEffect(()=>{
        fetchRandomFlag();
    }, [])

  return (
    <section className="md:w-1/3 w-full h-auto p-4 shadow-2xl shadow-black rounded-2xl">
        <div className="w-full h-auto p-3 flex items-center justify-center">
            <p className="text-cyan-900 font-bold md:text-4xl text-2xl">GUESS THE FLAG</p>
        </div>
        <div className="w-full h-auto flex items-center justify-center ">
            <p className="text-cyan-900 text-xl font-medium mr-2">Score: <span className="text-green-700 font-bold">{score}</span></p>
            <p className="text-cyan-900 text-xl font-medium ml-2">Attempts: <span className="text-red-700 font-bold">{count}/3</span></p>
        </div>
        <div className="w-full h-auto flex items-center justify-center py-5">
            <img src={flagData.img} alt="flag" className="w-18 h-18"/>
        </div>
        {showHint && 
            <div className="w-full p-2 text-center">
                <p className="text-lg font-semibold text-red-500">HINT:</p>
                <div className="w-full flex items-center justify-center">
                    <p className="mr-2 text-lg text-cyan-900 font-semibold">Region: <span className="text-red-600">{hint.region}</span></p>
                    <p className="ml-2 text-lg text-cyan-900 font-semibold">Capital: <span className="text-red-600">{hint.capital}</span></p>
                </div>
            </div>
        }
        { answer.whenWrongAnswer &&
            <div className="w-full h-auto py-2 flex items-center justify-center">
                <p className="text-xl font-medium text-cyan-950">The answer is: <span className="font-bold text-green-800">{answer.whenWrongAnswer}</span></p>
            </div>
        }
        <div className="w-full h-auto flex items-center justify-center">
            <p className="text-2xl font-semibold text-cyan-900">{answer.maskedWord}</p>
        </div>
        <form action="" onSubmit={(e)=>{e.preventDefault(); checkGuess();}} className="w-full h-auto p-2 text-center">
            <input type="text" onChange={handleInput} required value={flagGuess} placeholder="Enter the Flag Name" className="w-4/5 p-2 bg-transparent text-cyan-900 outline-0 border-b-2 border-cyan-900 placeholder-cyan-900 md:text-2xl text-lg "/>
            <button type="submit" className="w-4/5 text-2xl text-white font-semibold py-3 mt-2 bg-cyan-800 rounded-2xl border-2 border-cyan-900 hover:bg-white hover:text-cyan-900 hover:scale-110 transition-all duration-200">Submit</button>
        </form>
        <div className="w-full flex items-center justify-center">
            <button onClick={showhint} className="w-3/5 mx-2 flex items-center justify-center text-2xl text-white font-semibold py-3 bg-cyan-600 rounded-2xl hover:scale-110 transition-all duration-200"><HiOutlineLightBulb size={30}/>Hint</button>
        </div>
        <ToastContainer />
    </section>
  )
}

export default Container