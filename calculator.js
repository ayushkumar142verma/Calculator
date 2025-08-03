
const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');
const processDisplay = calculator.querySelector('.calculation-process');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let calculationString = '';

keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            calculate();
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            if (Number.isFinite(parseFloat(value))) {
                inputDigit(value);
            }
    }
    updateProcessDisplay();
});

function inputDigit(digit) {
    const currentValue = display.value;
    if (waitingForSecondValue === true) {
        display.value = digit;
        waitingForSecondValue = false;
    } else {
        display.value = currentValue === '0' ? digit : currentValue + digit;
    }
}

function inputDecimal(dot) {
    if (waitingForSecondValue === true) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }
    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);
    
    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        calculationString = `${firstValue} ${operator}`;
        return;
    }
    
    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstValue, inputValue);
        display.value = String(result);
        firstValue = result;
    }
    
    waitingForSecondValue = true;
    operator = nextOperator;
    calculationString = `${firstValue} ${operator}`;
}

function calculate() {
    if (operator === null || waitingForSecondValue) {
        return;
    }
    
    const inputValue = parseFloat(display.value);
    const result = performCalculation[operator](firstValue, inputValue);
    
    calculationString += ` ${inputValue} =`;
    display.value = String(result);
    firstValue = result;
    operator = null;
    waitingForSecondValue = true;
}

const performCalculation = {
    '/': (firstNum, secondNum) => firstNum / secondNum,
    '*': (firstNum, secondNum) => firstNum * secondNum,
    '+': (firstNum, secondNum) => firstNum + secondNum,
    '-': (firstNum, secondNum) => firstNum - secondNum,
};

function resetCalculator() {
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    display.value = '0';
    calculationString = '';
}

function updateProcessDisplay() {
    if (operator && !waitingForSecondValue) {
        processDisplay.textContent = `${calculationString} ${display.value}`;
    } else if (calculationString.includes('=')) {
        processDisplay.textContent = calculationString;
    } else {
        processDisplay.textContent = calculationString;
    }
}