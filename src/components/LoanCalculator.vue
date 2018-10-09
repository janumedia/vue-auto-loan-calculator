<template>
    <div class="calculator-container">
        <div class="calculator">
            <div class="calculator-form">
                <custom-input type="number" label="Car price" prefix="$" :inValid="invalidCarPrice" @blur="calculate" v-model="carPrice"/>
                <custom-input type="number" label="Downpayment" prefix="$" :inValid="invalidDownpayment" @blur="calculate" v-model="downPayment"/>
                <div>
                    <custom-input type="number" label="Loan duration" class="input-duration" @blur="calculate" v-model="duration"/>
                    <toggle-button @change="calculate" v-model="isYearly"/>
                </div>
                <div>
                    <custom-input type="number" label="Interest rate" sufix="%" class="input-interest" :inValid="invalidInterestRate" @blur="calculate" v-model="interestRate"/>
                    <custom-input type="date" label="Start date" class="input-date" :inValid="invalidStartDate" @blur="calculate" v-model="startDate"/>
                </div>
                <custom-button @click="calculate">Calculate</custom-button>
            </div>
            <div class="calculator-result">
                <h2>Result:</h2>
                <p>Estimate monthly payment</p>
                <p class="label-monthly-payment">{{ monthlyPayment }}</p>
                <br>
                <p>Total Principal Paid <span class="font--bold">{{ numFormat(principalTotal) }}</span></p>
                <p>Total Interest Paid <span class="font--bold">{{ numFormat(interestTotal) }}</span></p>
                <br>
                <p>Estimated Payoff Date</p>
                <p class="label-payoff-date">{{ payoffDate }}</p>
            </div>
        </div>
        <p v-show="amortizationList.length > 0" class="table-title font--bold">Amortization Schedule</p>
        <Table v-show="amortizationList.length > 0">
            <template slot="header">
                <th v-for="(item, index) in headers" :key="index" :class="item.resposive ? 'responsive' : ''">{{ item.label }}</th>
            </template>
            <template slot="body">
                <tr v-for="(item, index) in amortizationList" :key="index">
                    <td v-for="(label, subIndex) in item" :key="subIndex" :class="subIndex == 'monthlyPayment' || subIndex == 'principal' ? 'responsive' : ''">{{ label }}</td>
                </tr>
            </template>
        </Table>
    </div>
</template>
<script>
import CustomButton from '@/components/core/CustomButton.vue'
import CustomInput from '@/components/core/CustomInput.vue'
import ToggleButton from '@/components/core/ToggleButton.vue'
import Table from '@/components/Table.vue'
import { numFormat, dateFormat } from '@/utils/Utils'
export default {
    components: {
        CustomButton, CustomInput, ToggleButton, Table
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
            isYearly: false,
            startDate: this.dateFormat(new Date()),
            payoffDate: this.dateFormat(new Date(), true),
            headers: [
                    { label: "Payment Date" }, 
                    { label: "Payment", resposive: true },
                    { label: "Principal", resposive: true }, 
                    { label: "Interest" }, 
                    { label: "Total Interest" }, 
                    { label: "Balance" }
                    ],
            amortizationList: []
        }
    },
    computed: {
        principalTotal() {
            return this.carPrice - this.downPayment;
        }
    },
    methods: {
        invalidCarPrice() {
            if(Number(this.carPrice) < 100 || Number(this.carPrice) < Number(this.downPayment)) return "Price to low";
            return false;
        },
        invalidDownpayment() {
            if(Number(this.carPrice) < Number(this.downPayment)) return "Invalid downpayment";
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
            let count = this.isYearly ? this.duration * 12 : this.duration;
            let i = this.interestRate * 0.01 / 12;
            let l = Math.pow(1 + i, count);
            let result = this.principalTotal * i * l / (l - 1);

            this.monthlyPayment = this.numFormat(Math.round(result)); 
            this.amortizationList = [];
            
            let principal, interest, date = new Date(this.startDate),
                totalInterest = 0, balance = this.principalTotal;

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
                    monthlyPayment: this.monthlyPayment,
                    principal: this.numFormat(Math.round(principal)), 
                    interest: this.numFormat(Math.round(interest)), 
                    totalInterest: this.numFormat(Math.round(totalInterest)), 
                    balance: this.numFormat(Math.round(balance))
                });
                balance -= principal;
                count--;
            }
            this.interestTotal = totalInterest;
            this.payoffDate = this.dateFormat(date, true);
        },
        numFormat,
        dateFormat
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
.calculator {
    width: 100%;
    margin: 0 0 20px;
    padding: 0;
    border: 1px solid $border-color;
    > div {
        display: inline-block;
        width: 50%;
        padding: 20px;
        vertical-align: top;
    }
}

.calculator-form {
    background-color: $secondary;
}

.calculator-result {
    text-align: center;
}

.input-duration {
    width: calc(100% - 140px);
    display: inline-block;
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
    font-size: 2.6em;
    font-weight: 700;
    margin: 20px 0 0;
}

.label-payoff-date {
    font-size: 1.5em;
    font-weight: 700;
    margin: 0;
}

.table-title {
    margin-top: 40px;
    font-size: 1.2em;
}

@media only screen and (max-width:767px) {
    .calculator {
        > div {
            width: 100%;
        }
    }
    .responsive {
        display: none;
    }
}

@media only screen and (max-width: 414px) {
    .calculator {
        border: 0;
    }
    .input-interest {
        width: 90px;
    }
    .input-date {
        width: calc(100% - 130px);
    }
    .table-title {
        text-align: center;
    }
}

</style>