const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./user');
const Event = require('./event');

const app = express();
const PORT = 3000;

//password: VGCDd7GAAQaZu2rc
//mongodb+srv://tengekking8:<password>@loginandregister.deimifl.mongodb.net/?retryWrites=true&w=majority&appName=loginAndRegister
//mongodb+srv://tengekking8:<password>@loginandregister.deimifl.mongodb.net/

let pageHasBeenReloaded = false;

// Use cors middleware
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://tengekking8:VGCDd7GAAQaZu2rc@loginandregister.deimifl.mongodb.net/?retryWrites=true&w=majority&appName=loginAndRegister");

app.post('/register', async(req, res) => 
{
    const email = req.body.email;
    User.findOne({email})
    .then((user) => 
    {
        if (user)
        {
            res.json("Already exists");
        }
        else 
        {
            User.create(req.body)
            .then((user) => 
            {
                res.json(user)
            })
            .catch((error) => res.json(error))
        }
    })
})

app.post("/login", async(req, res) => 
{
    const {email, password} = req.body;
    User.findOne({email})
    .then((user) => 
    {
        if (user)
        {
            if (user.password === password)
            {
                res.json("Success");
            }
            else 
            {
                res.json("Wrong password");
            }
        }
        else 
        {
            res.json("User does not exist");
        }
    })
})


let browser;
let page; 

const initializeBrowser = async () => 
{
    browser = await puppeteer.launch
    ({
        headless: true,
        defaultViewport: null,
        args: ['--disable-features=site-per-process']
    });
    page = await browser.newPage();
};

const scrapeData = async () => 
{
    let b = false;
    if (page.url() !== 'https://sxodim.com/almaty')
    {
        await page.goto('https://sxodim.com/almaty');
        b = true;
    }

    if (!b)
    {
        const showMore = await page.$(".impression-btn-secondary");
        await showMore.click();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const data = await page.evaluate(() => {
        let cards = [];
        document.querySelectorAll('.impression-card').forEach((element) => 
        {
            let description, title, link;
            if (element.getAttribute("data-category") !== "Подборки") 
            {
                description = element.querySelector('.impression-card-info').innerText;
                title = element.querySelector('.impression-card-title').innerText;
                link = element.querySelector('img').src;
            }
            if (description) {
                cards.push({ description, title, link });
            }
        });
        return cards;
    });

    return data;
};

app.put('/close-and-reopen', async (req, res) => 
{
    try 
    {
        if (browser) 
        {
            await browser.close();
            initializeBrowser();
            res.status(200).send('Browser closed and reopened successfully');
        } 
        else 
        {
            res.status(200).send('Browser was already closed or not initialized');
        }
    } 
    catch (error) 
    {
        console.error('Error while closing and reopening browser:', error);
        res.status(500).send('Error while closing and reopening browser');
    }
});



app.get('/scrape', async (req, res) => 
{
    try 
    {
        if (!browser || !page) 
        {
            await initializeBrowser();
        }
        const data = await scrapeData();
        res.json({ data });
    } 
    catch (error) 
    {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/load-more', async (req, res) => 
{
    try 
    {
        if (!browser || !page) 
        {
            await initializeBrowser();
        }
        const additionalData = await scrapeData();
        res.json({ additionalData });
    } 
    catch (error) 
    {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => 
{
    console.log(`Server is running on http://localhost:${PORT}`);
});
