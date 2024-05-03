import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './App.module.css'
import axios from 'axios'
import Card from "./Card"
import Header from './components/Header'
import { addMonths, format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { Box, CircularProgress, Skeleton, Stack } from '@mui/material'
import ModalWindow from './ModalWindow'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'

/*
logo colors:
#E9E4DE
#14293A
#99ABC1
*/

function App() {
  const navigate = useNavigate();
  const [modalCard, setModalCard] = useState(-1);

  function getNextThreeMonthsDays() 
  {
    const currentDate = new Date();
    const threeMonthsAheadDate = addMonths(currentDate, 3);
    const daysArray = [];

    // Loop through each day in the next three months
    for (let date = currentDate; date <= threeMonthsAheadDate; date.setDate(date.getDate() + 1)) 
    {
        const formattedDate = format(date, 'dd MMMM, yyyy', { locale: ruLocale });
        daysArray.push(formattedDate);
    }

    return daysArray;
  }

  const threeMonthsDays = getNextThreeMonthsDays();

  const options = threeMonthsDays;
  const options2 = threeMonthsDays;
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedIndex2, setSelectedIndex2] = useState(8);
  const [parsedData, setParsedData] = useState(null);

  const fetchData = async () => 
  {
    await new Promise(resolve => setTimeout(resolve, 5000));
    try 
    {
      const response = await axios.get("http://localhost:3000/scrape");
      console.log(response.data.data);
      setParsedData(response.data.data);
    }
    catch(error)
    {
      console.log(error);
    }
  }

  const fetchMoreData = async () => 
  {
    try
    {
      setParsedData(null);
      const response = await axios.get("http://localhost:3000/load-more");
      setParsedData(response.data.additionalData);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  useEffect(() => 
  {
    fetchData();
    const handleBeforeUnload = async (event) => 
    {
      if (localStorage.getItem("user"))
      {
        localStorage.removeItem(localStorage.getItem("user"));
        localStorage.removeItem("user");
      }
      event.preventDefault(); 
      try 
      {
        await axios.put('http://localhost:3000/close-and-reopen');
      } 
      catch (error) 
      {
        console.error('Error executing PUT request:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => 
    {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [])

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => 
  {
    setInputValue(e.target.value);
  }

  const [cards, setCards] = useState([]);
  
  useEffect(() => 
  {
    let arr = [], ind = 0;
    for (let i = 0; i < parsedData?.length; i++)
    {
      if (parsedData[i].title.toLowerCase().includes(inputValue.toLowerCase()))
      {
        let val = ind;
        arr.push
        (
          <Card img={parsedData[i].link} description={parsedData[i].description} title={parsedData[i].title} showModalCard={() => setModalCard(val)}></Card>
        )
        ind++;
      }
    }
    setCards(arr);
    sortBasedOnDates(options, selectedIndex, selectedIndex2);
  }, [parsedData, inputValue])

  function sortBasedOnDates(dates, date1, date2)
  {
    if (!parsedData)
    {
      return;
    }
    
    let filteredCardsData = parsedData;
    filteredCardsData = filteredCardsData.filter((card) => 
    {

      const months = new Set();
      for (let i = date1; i <= date2; i++)
      {
        let start = dates[i].indexOf(' ');
        let end = dates[i].indexOf(',');
        const substr = dates[i].substring(start + 1, end);
        months.add(substr);
      }

      function checkMonth(str)
      {
        for (const month of months)
        {
          if (str.includes(month))
          {
            return true;
          }
        }
        return false;
      }

      if (!checkMonth(card.description))
      {
        return false;
      }
      else
      {
        let start = dates[date1].indexOf(' ');
        let end = dates[date1].indexOf(',');
        const substr1 = dates[date1].substring(start + 1, end);

        start = dates[date2].indexOf(' ');
        end = dates[date2].indexOf(',');
        const substr2 = dates[date2].substring(start + 1, end);

        if (!card.description.includes(substr1) && !card.description.includes(substr2))
        {
          return true;
        }
        else
        {
          if (card.description.includes(substr1) && !card.description.includes(substr2))
          {
            let ind = card.description.indexOf(substr1);
            let cardNumericValue = parseInt(card.description.substring(ind - 3, ind - 1), 10);
            let dateNumericValue = parseInt(dates[date1].substring(0, dates[date1].indexOf(' ')), 10);
            return dateNumericValue <= cardNumericValue;
          }
          else if (card.description.includes(substr2) && !card.description.includes(substr1))
          {
            let ind = card.description.indexOf(substr2);
            let cardNumericValue = parseInt(card.description.substring(ind - 3, ind - 1), 10);
            let dateNumericValue = parseInt(dates[date2].substring(0, dates[date1].indexOf(' ')), 10);
            return cardNumericValue <= dateNumericValue;
          }
          else 
          {
            let ind = card.description.indexOf(substr1);
            let cardNumericValue = parseInt(card.description.substring(ind - 3, ind - 1), 10);
            let dateNumericValue1 = parseInt(dates[date1].substring(0, dates[date1].indexOf(' ')), 10);
            
            let dateNumericValue2 = parseInt(dates[date2].substring(0, dates[date1].indexOf(' ')), 10);
            return (dateNumericValue1 <= cardNumericValue && cardNumericValue <= dateNumericValue2);
          }
        }
      }

    });

    let arr = [], ind = 0;
    for (let i = 0; i < filteredCardsData.length; i++)
    {
      if (filteredCardsData[i].title.toLowerCase().includes(inputValue.toLowerCase()))
      {
        let val = ind;
        arr.push
        (
          <Card img={filteredCardsData[i].link} description={filteredCardsData[i].description} title={filteredCardsData[i].title} showModalCard={() => 
            {
              setModalCard(val);
              navigate(`/${val}`);
            }}
          ></Card>
        )
        ind++;
      }
    }

    setCards(arr);
  }

  if (parsedData)
  {
    return (
      <div className={styles.app}>
        <Header options={options} options2={options2} selectedIndex={selectedIndex} selectedIndex2={selectedIndex2} setSelectedIndex={setSelectedIndex} setSelectedIndex2={setSelectedIndex2} inputValue={inputValue} handleInputChange={handleInputChange} sortBasedOnDates={sortBasedOnDates} fetchMoreData={() => fetchMoreData()} navigate={navigate}></Header>
        <div className={styles.cards}>
          {cards}
        </div>
        <Routes>
        {
          modalCard !== -1 && 
            <Route exact path={'/'+ modalCard} element={<ModalWindow title={cards[modalCard].props.title} description={cards[modalCard].props.description.split(',')} img={cards[modalCard].props.img} setModalCard={setModalCard} navigate={navigate}></ModalWindow>} />
        }
          <Route exact path={'/login'} element={<Login navigate={navigate}></Login>} />
        </Routes>
      </div>
    )
  }
  else
  {
    return (
      <>
        <CircularProgress/>
        <div className={styles.cards}>
          {
            [1,2,3,4,5,6,7,8,9].map((elem) => 
            <Stack sx={{marginRight: 6, marginLeft: 6, mb: 2, mt: 4}} spacing={1}>
              <Skeleton variant='text' sx={{fontSize: '2rem'}}></Skeleton>
              <Skeleton variant='rectangular' width={328} height={200}></Skeleton>
            </Stack>
          )
          }
        </div>
      </>
    );
  }
}

export default App
