<template>
  <div id="app">
    <h1 class="text--center">Auto Loan Calculator</h1>
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
@import '@/assets/css/_utils.scss';
</style>
