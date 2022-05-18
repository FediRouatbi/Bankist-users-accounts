'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Fedi Rouatbi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-02-17T17:01:17.194Z',
    '2022-02-20T23:36:17.929Z',
    '2022-02-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const calcDayPassed = (date1, date2) =>
  Math.trunc(Math.abs((date1 - date2) / (24 * 60 * 60 * 1000)));
const formatDate = function (date) {
  const DayPassed = calcDayPassed(date, new Date());
  if (DayPassed === 0) return 'Today';
  if (DayPassed === 1) return 'Yesterday';
  if (DayPassed <= 7) return `${DayPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const displayMoneyFormat = function (acc) {
  const option = {
    style: 'currency',
    unit: 'celsius',
    currency: acc.currency,
  };
  return new Intl.NumberFormat(acc.locale, option);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const formatedDate = formatDate(date);
    const coin = displayMoneyFormat(acc).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${formatedDate}</div>
        <div class="movements__value">${coin}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = displayMoneyFormat(acc).format(acc.balance);
};

const calcDisplaySummary = function (acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = displayMoneyFormat(acc).format(incomes);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = displayMoneyFormat(acc).format(out);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = displayMoneyFormat(acc).format(interest);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
const timeNow = function (acc) {
  /*   const timeNow = new Date();
  const day = `${timeNow.getDate()}`.padStart(2, 0);
  const month = `${timeNow.getMonth() + 1}`.padStart(2, 0);
  const year = `${timeNow.getFullYear()}`;
  const hour = `${timeNow.getHours()}`.padStart(2, 0);
  const min = `${timeNow.getMinutes()}`.padStart(2, 0);
  const secondes = `${timeNow.getSeconds()}`.padStart(2, 0);
  return `${day}/${month}/${year}       ${hour}:${min}:${secondes}`; */

  const option = {
    year: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    /* weekday: 'long', */
    hour: 'numeric',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat(acc.locale, option).format(new Date());
};

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call print remaining time
    labelTimer.textContent = `${min}:${sec}`;

    //wen 0 sec , stop timer and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      labelDate.textContent = '';
      containerApp.style.opacity = 0;
    }
    //decrese 1s
    time--;
  };
  //set time to 5 min
  let time = 30;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers

let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    labelDate.textContent = timeNow(currentAccount);
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //timerr
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    const timer = setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }

  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
document.querySelector('.logo').addEventListener('click', function () {
  console.log(
    [...document.querySelectorAll('.movements__row')].forEach((val, i) => {
      if (i % 2 == 0) val.style.backgroundColor = 'orange';
    })
  );
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const args = ['thon', 'salade'];

const pizzaTimer = setTimeout(
  (arg1, arg2) => console.log(`here is your pizza with ${arg1} and ${arg2}`),
  3000,
  ...args
);
if (args.includes('thon')) clearTimeout(pizzaTimer);

setInterval(() => {
  const now = new Date();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minute = `${now.getMinutes()}`.padStart(2, 0);
  const second = `${now.getSeconds()}`.padStart(2, 0);
  const noww = `${hour}:${minute}:${second}`;
  console.log(noww);
}, 1000); */
