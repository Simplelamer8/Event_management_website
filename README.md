1) First of all we need to install npm:
```
npm install npm@latest -g
```
2) Clone the repo
```
git clone https:github.com/Simplelamer8/Event_management_website.git
```
3) move to "site" folder
```
cd site
```
4) install all dependencies for Frontend
```
npm install 
```
5) move back to upper directory
```
cd ..
```
6) move to "parser" folder
```
cd parser
```
7) install all dependencies for Backend & start the server
```
npm install 
node index.js
```
8) open the new console tab by clicking plus icon (VScode) or Ctrl + Shift + tilda mark (~)
9) now move back to site folder
```
cd ..
cd site
```
10) and Run
```
npm run dev
```
11) click on the link that appeared in the console & open the browser



How the app has been developed:  
Возможно, уникальность этого проекта в том, что он может извлекать данные бесконечно, пока данные на самом сайте не закончатся.  
Был написан простой парсер веб-страницы https://sxodim.com/almaty с использованием библиотеки Puppeteer, однако процесс проверки дат,
чтобы разобраться в событиях, занял значительное количество времени. Поскольку требовалось извлечь значение дат из строки.  
В связи с тем что оставалось очень мало времени мне не удалось связать аккаунт с ивентами и данный функционал работает через localStorage а не через полноценный backend  
Не получилось связать сервис с google calendar. 
