<template>
    <div class="calculator-container">
        <div class="calculator">
            <div class="calculator-form">
                <custom-input type="number" label="Car Price" prefix="$" :inValid="invalidCarPrice" @blur="calculate" v-model="carPrice"/>
                <custom-input label="Downpayment" prefix="$" :inValid="invalidDownpayment" @blur="calculate" v-model="downPayment"/>
                <custom-input label="Loan duration (in month)" @blur="calculate" v-model="duration"/>
                <div class="column">
                    <custom-input label="Interest rate" sufix="%" class="input-interest" :inValid="invalidInterestRate" @blur="calculate" v-model="interestRate"/>
                    <custom-input label="Start date" class="input-date" :inValid="invalidStartDate" @blur="calculate" v-model="startDate"/>
                </div>
                <button @click="calculate">Calculate</button>
            </div>
            <div class="calculator-result">
                <h2>Result:</h2>
                <p>Estimate monthly payment</p>
                <p class="label-monthly-payment">{{ monthlyPayment }}</p>
                <p>Total Principal Paid <span class="bold">{{ `$${numFormat(loan)}` }}</span></p>
                <p>Total Interest Paid <span class="bold">{{ `$${numFormat(interestTotal)}` }}</span></p>
                <p>Estimated Payoff Date</p>
                <p class="label-payoff-date">{{ payoffDate }}</p>
            </div>
        </div>
        <Table v-show="amortizationList.length > 0"
            :headers="headers"
            :items="amortizationList"
        />
    </div>
</template>
<script>
import CustomInput from '@/components/core/CustomInput.vue'
import Table from '@/components/Table.vue'
export default {
    components: {
        CustomInput, Table
    },
    mounted() {
        this.calculate();
    },
    data(){
        return {
            carPrice: 25000,
            downPayment: 5000,
            monthlyPayment: 0,
            interestRate: 3,
            interestTotal: 0,
            duration: 60,
            startDate: this.dateFormat(new Date()),
            payoffDate: this.dateFormat(new Date(), true),
            headers: ["Payment Date", /*"Payment", "Principal", */"Interest", "Total Interest", "Balance"],
            amortizationList: []
        }
    },
    computed: {
        loan() {
            return this.carPrice - this.downPayment;
        }
    },
    methods: {
        invalidCarPrice() {
            if(Number(this.carPrice) < 100) return "Price to low";
            return false;
        },
        invalidDownpayment() {
            if(this.downPayment.length == 0) return "Invalid downpayment";
            return false;
        },
        invalidInterestRate() {
            if(Number(this.interestRate) <= 0 || Number(this.interestRate) > 98) return "Invalid rate";
            return false;
            
        },
        invalidStartDate() {
            let date =  new Date(this.startDate)
            let invalid = date == 'Invalid Date';
            if(invalid || date.getFullYear().toString().length != 4) return "Invalid date"
            this.startDate = this.dateFormat(date);
            return false;
        },
        calculate(e) {
            //don't process if has error input
            if(this.$el.querySelector('.custom-input--error')) return;
            //formula reference: https://www.wikihow.com/Calculate-Total-Interest-Paid-on-a-Car-Loan
            let i = this.interestRate * 0.01 / 12;
            let l = Math.pow(1 + i, this.duration);
            let result = this.loan * i * l / (l - 1);

            this.monthlyPayment = `$${this.numFormat(Math.round(result))}`; 
            this.amortizationList = [];
            
            let principal, interest, date = new Date(this.startDate),
                totalInterest = 0, balance = this.loan, count = this.duration;

            while(count >= 0) {
                //set next month
                date.setMonth(date.getMonth() + 1);
                interest = balance * i;
                totalInterest += interest;
                principal = result - interest;
                if(interest < 0) interest = 0;
                if(balance < 0) balance = 0;
                this.amortizationList.push({
                    date: this.dateFormat(date),
                    //monthlyPayment: this.monthlyPayment,
                    //principal: `$${this.numFormat(Math.round(principal))}`, 
                    interest: `$${this.numFormat(Math.round(interest))}`, 
                    totalInterest: `$${this.numFormat(Math.round(totalInterest))}`, 
                    balance: `$${this.numFormat(Math.round(balance))}`
                });
                balance -= principal;
                count--;
            }
            this.interestTotal = totalInterest;
            this.payoffDate = this.dateFormat(date, true);
        },
        numFormat(number) {
            if(number === undefined) return ""
            if(typeof number === "string") number = Number(number)
            //https://stackoverflow.com/a/14428340/1578100
            return number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
        },
        dateFormat(date, locale) {
            if(locale) {
                let options = { year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString("en-US", options);
            }
            return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
.calculator {
    width: 100%;
    margin: 0 0 20px;
    padding: 0;
    border: solid 1px #ccc;
    > div {
        display: inline-block;
        width: 50%;
        padding: 20px;
        vertical-align: top;
    }
}

.calculator-form {
    background-color: aquamarine;
}

.calculator-result {
    text-align: center;
}

button {
    width: 100%;
    height: 50px;
    font-size: 1.6em;
    font-weight: bold;
    border: none;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;    
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display:inline-block;
    padding: 0;
    vertical-align:middle;
    text-decoration:none;
    color:$primary-text;
    background-color: $primary;
    text-align:center;
    cursor:pointer;
    white-space:nowrap;
    transition: 0.4s;
    outline: none;
    &:hover {
        color: $primary;
        background-color:white;
    }
}
.input-interest {
    width: 120px;
    display: inline-block;
}
.input-date {
    width: calc(100% - 160px);
    display: inline-block;
    vertical-align: top;
    margin-left: 40px;
}

.label-monthly-payment {
    font-size: 2.2em;
    font-weight: 700;
    margin: 0;
}

.label-payoff-date {
    font-size: 1.5em;
    font-weight: 700;
    margin: 0;
}

.bold {
    font-weight: bold;
}

// avoid zoom in iOS mobile device when entering input
@media screen and (-webkit-min-device-pixel-ratio:0) {
    select,
    textarea,
    input,
    button {
        font-size: 16px;
    }
}

@media only screen and (max-width:767px) {
    .calculator {
        > div {
            width: 100%;
        }
    }
}

</style>