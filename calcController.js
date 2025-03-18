class CalcControlller {
    constructor(){
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.currentDate;
        this.initialize(); 
        this.initButtonsEvents();
    }

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=> {
            this.setDisplayDateTime();
       }, 1000);
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
        return (['+', '-', '/', '*'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.lenght > 3){
            this.calc();
        }
    }

    calc(){
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result, last];
    }

    setLastNumberToDisplay(){
        
    }

    addOperation(value){
        //[1] - ultimo no array não é número
        if(isNaN(this.getLastOperation())){
            //string
            //[2] - okay, mas é operador?
            if(this.isOperator(value)){
                //troca operador
                this.setLastOperation(value);
            } else if(isNaN(value)) {
                
                //ultimo no array não é número mas o atual é
            } else {
                //da um push simples de numero e daí o prox número cai na situação lá de baixo
                this.pushOperation(value);
            }
        //[1] - ultimo no array é número
        } else {
            //[2] - okay, mas é operador?
            if(this.isOperator(value)){
                this.pushOperation(value);
            } else {
                //último número e novo número
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                //atualizar display
                this.setLastNumberToDisplay();
            }
            //numero
            
        }
        console.log(this._operation);
    }

    clearAll(){
        this._operation = [];
    }

    clearEntry(){
        this._operation.pop();
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
                this.soma();
                break;  
            case 'ponto':
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