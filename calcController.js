class CalcControlller {
    constructor(){
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.currentDate;
        this.initialize(); 
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=> {
            this.setDisplayDateTime();
       }, 1000);
        this.setLastNumberToDisplay();
    }

    initKeyboard(){
        document.addEventListener('keyup', e => {
            console.log(e.key);

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                    this.addOperation('+');
                    break;
                case '-':
                    this.addOperation('-');
                    break;
                case '/':
                    this.addOperation('/');
                    break;
                case '*':
                    this.addOperation('*');
                    break;
                case '%':
                    this.addOperation('%');
                    break;
                case '=':
                    this.calc();
                    break;  
                case 'Enter':
                    this.calc();
                    break;
                case '.':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;                           
            }
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    setError(){
        this.displayCalc = "Error"
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
        return (['+', '-', '/', '*', '%'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        return eval(this._operation.join(""));
    }

    calc(){
        //setando variável
        let last = '';
        this._lastOperator = this.getLastItem();
        //tratando exceção
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop(); 
            this._lastNumber = this.getResult();

        } else if(this._operation.length == 3){
                this._lastNumber = this.getLastItem(false);
        }
        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        //fluxo normal
        let result = this.getResult();

        if(last == '%'){
            result = result / 100;
            this._operation = [result];
        } else {
            
            this._operation = [result];     
            if(last) this._operation.push(last);   
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;
        for(let i = this._operation.length - 1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
            
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber && lastNumber != '.'){
            lastNumber = 0;
        }
        this.displayCalc = lastNumber;
    }

    addOperation(value){
        //[1] - ultimo no array não é número
        if(isNaN(this.getLastOperation())){
            //string
            //[2] - okay, mas é operador?
            if(this.isOperator(value)){
                //troca operador
                this.setLastOperation(value);
            } else {
                //da um push simples de numero e daí o prox número cai na situação lá de baixo
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        //[1] - ultimo no array é número
        } else {
            //[2] - okay, mas é operador?
            if(this.isOperator(value)){
                this.pushOperation(value);
            } else {
                //último número e novo número
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();
            }
            //numero
            
        }
        console.log(this._operation);
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return;
        }

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;  
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;                           
            default:
                this.setError();
                break;      
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index) => {
                this.addEventListenerAll(btn,"click drag", () => { 
                let textBtn = btn.className.baseVal.replace('btn-',"");
                this.execBtn(textBtn); 
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            })
        });
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this.currentDate = value;
    }
}