/* library
*/

function toArray(C) {
    var B = C.length,
        A = new Array(B);
    while (B--) {
        A[B] = C[B];
    }
    return A;
};

Function.prototype.closureListener = function() {
    var A = this,
        C = toArray(arguments), 
        B = C.shift();
    return function(E) {
        E = E || window.event;
        if (E.target) {
            var D = E.target;
        } else {
            var D = E.srcElement;
        }
        return A.apply(B, [E, D].concat(C));
    };
};

function Calculator9(target) {
    var calPn = $('#'+target);
    var calArr = [1,2,3,'+', 4,5,6,'-', 7,8,9,'*', '0','=','c','/'];
    var _self = this;
    this.inputNumber = $('<input type="text" id="inputNumber"/>');
    this.inputNumber.keydown(this.inputNumberKeydown.closureListener(this));    
    calPn.append(this.inputNumber);
    
    $.each(calArr, function(i, e){
        calPn.append($('<button>').text(e).bind('click', _self.buttonClick.closureListener(_self)));
    });

    this.firstValue = null;
    this.calOperator = null;
    this.chkOperator = false;    
}

Calculator9.prototype.inputNumberKeydown = function(event){
    var keyCode = event.keyCode;
    event.preventDefault();

    if (keyCode >= 96 && keyCode <= 105) {    // 0-9 in keypad 
        keyCode = keyCode-48;
    } else
    if (keyCode >= 106 && keyCode <= 111) { // *+/- in keypad 
        keyCode = keyCode-64;
    } else
    if (keyCode === 13) { // enter -> =
        keyCode = 61;        
    }

    var value = String.fromCharCode(keyCode);
        
    if (/[0-9+\-*/=c]/i.test(value)) {
        this.processInputValue(value);
    }
}

function calculateValue(fvalue, svalue, op) {
    fvalue = parseInt(fvalue);
    svalue = parseInt(svalue);
    switch(op) {
        case '+': return fvalue + svalue;
        case '-': return fvalue - svalue;
        case '*': return fvalue * svalue;
        case '/': return fvalue / svalue;
        default : return 0;
    }     
}

Calculator9.prototype.buttonClick = function(event) {
    this.processInputValue($(event.target).text());
}

Calculator9.prototype.processInputValue = function(value) {
    switch(value) {
        case '+': 
        case '-':
        case '*':
        case '/': 
            if (this.chkOperator) {
                this.calOperator = value;
                return;
            } else
            if (this.firstValue) {
                this.inputNumber.val(calculateValue(this.firstValue, this.inputNumber.val(), this.calOperator));
            }
            this.firstValue = this.inputNumber.val();
            this.calOperator = value;
            this.chkOperator = true;
            break;
        case 'c':
        case 'C':
            setInit(this, '');
            break;
        case '=':
            setInit(this, calculateValue(this.firstValue, this.inputNumber.val(), this.calOperator) );
            break;
        default:
            if (this.chkOperator) {
                this.inputNumber.val('');
            }
            this.chkOperator = false;
            this.inputNumber.val(this.inputNumber.val() + value);
    } 
    
    function setInit(obj, value) {
        obj.firstValue = null;
        obj.calOperator = null;
        obj.inputNumber.val(value);
    }
}
