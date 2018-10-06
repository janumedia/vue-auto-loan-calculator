<template>
  <div id="app">
    <h1>Auto Loan Calculator</h1>
    <loan-calculator/>
  </div>
</template>

<script>
import LoanCalculator from './components/LoanCalculator.vue'

export default {
  name: 'app',
  components: {
    LoanCalculator
  }
}
</script>

<style lang="scss">
@import '@/assets/css/_reset.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
h1 {
  text-align: center;
}
</style>
