<script>
import Table from '@/components/Table.vue'
export default {
    components: {
        Table
    },
    data(){
        return {
            carPrice: 25000,
            downPayment: 5000,
            //loan: 15000,
            monthlyPayment: 0,
            interest: 3,
            interestTotal: 0,
            duration: 60,
            headers: ["Monthly", "Principal", "Interest", "Total Interest", "Balance"],
            result: null
        }
    },
    computed: {
        loan() {
            return this.carPrice - this.downPayment;
        }
    },
    methods: {
        calculate() {
            //https://www.wikihow.com/Calculate-Total-Interest-Paid-on-a-Car-Loan
            //var p = 15000;
            //var i = 3
            //var totalMonths = 36;
            var a = this.interest * 0.01 / 12;
            var b = Math.pow(1 + a, this.duration);
            var c = this.loan * a * b / (b - 1);

            this.monthlyPayment = `$${this.numFormat(Math.round(c))}`; 
            //console.log("monthlyPayment:", monthlyPayment);
            var principal, interest, totalInterest = 0, balance = this.loan, count = this.duration;
            this.result = [];
            while(count >= 0) {
                interest = balance * a;
                totalInterest += interest;
                principal = c - interest;
                if(interest < 0) interest = 0;
                if(balance < 0) balance = 0;
                //console.log(monthlyPayment, Math.round(principal), Math.round(interest), Math.round(totalInterest), Math.round(balance));
                this.result.push({
                    monthlyPayment: this.monthlyPayment,
                    principal: `$${this.numFormat(Math.round(principal))}`, 
                    interest: `$${this.numFormat(Math.round(interest))}`, 
                    totalInterest: `$${this.numFormat(Math.round(totalInterest))}`, 
                    balance: `$${this.numFormat(Math.round(balance))}`
                });
                balance -= principal;
                count--;
            }
            this.interestTotal = totalInterest;
        },
        numFormat(number) {
            if(number === undefined) return ""
            if(typeof number === "string") number = Number(number)
            //https://stackoverflow.com/a/14428340/1578100
            return number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
        }
    }
}
</script>
<template>
    <div class="calculator_container">
        <div class="calculator">
            <div class="column calculator-form">
                <label>Car price</label>
                <input type="number" placeholder="Car Price" v-model="carPrice">
                <label>Downpayment</label>
                <input type="number" placeholder="Downpayment" v-model="downPayment">
                <label>Loan duration (in month)</label>
                <input type="text" placeholder="How Long" v-model="duration">
                <label>Interest rate</label>
                <input type="text" placeholder="Interest rate" v-model="interest">
                <button @click="calculate">Calculate</button>
            </div>
            <div class="column calculator-result">
                <h2>Result:</h2>
                <p>Estimate monthly payment:</p>
                <p class="label-monthly-payment">{{ monthlyPayment }}</p>
                <p>Total Principal Paid:</p>
                <p class="bold">{{ `$${numFormat(loan)}` }}</p>
                <p>Total Interest Paid:</p>
                <p class="bold">{{ `$${numFormat(interestTotal)}` }}</p>
            </div>
        </div>
        <Table v-show="result"
            :headers="headers"
            :items="result"
        />
    </div>
</template>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
.calculator {
    width: 100%;
    margin: 0 0 20px;
    padding: 0;
    border: solid 1px #ccc;
}

.calculator-form {
    background-color: aquamarine;
}

.calculator-result {
    text-align: center;
}

.column {
    display: inline-block;
    width: 50%;
    padding: 20px;
    vertical-align: top;
}
input, select, button {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    font-size: 1.2em;
}
button {
    border: none;//1px solid #ccc;;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;    
    
    text-transform: uppercase;
    letter-spacing: 0.04em;
    display:inline-block;
    padding: 0;
    vertical-align:middle;
    text-decoration:none;
    //font-size: 0.8em;
    color:$primary-text;
    background-color: $primary;
    text-align:center;
    cursor:pointer;
    white-space:nowrap;
    transition: 0.4s;
    &:focus {
        outline: none;
    }
    &:hover {
        color: $primary;
        background-color:#ccc;
    }
    & span,
    & a {
        display:block;
        color:#807e7e;
        padding:8px 16px;
        transform: 0.5s;
        text-decoration: none;
        cursor: pointer;
    }
    & > a:hover {
        color: $primary;
        background-color:#ccc;
    }
}
input, textarea, select {
    width: 100%;
    padding: 0.4em 0;
    //margin-top: 1em;
    border:0;
    border-bottom:1px solid rgb(167,172,162);
    background-color: inherit;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    -webkit-appearance: none; /* ios shadow removed */
    -moz-appearance:none;
    box-shadow:none;
    //font-family: 'Catamaran', sans-serif;
    //font-size: 0.9em;
    transition: 0.4s;
    &:focus {
        border-bottom:1px solid $primary;
    }
}

.label-monthly-payment {
    font-size: 2.2em;
    font-weight: 700;
    margin: 0;
}

.bold {
    font-weight: bold;
}

</style>