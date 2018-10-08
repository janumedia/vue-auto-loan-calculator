<template>
    <label class="switch">
        <input type="checkbox" @change="handleChange">
        <span class="slider"></span>
        <div class="switch-label">
            <span>Month</span>
            <span>Year</span>
        </div>
    </label>
</template>
<script>
export default {
    methods: {
        handleChange(e) {
            this.$emit('input', e.target.checked);
            this.$emit('change', this);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
.switch {
    position: relative;
    display: inline-block;
    height: 30px;
    color: $secondary-text;
}

.switch input {display:none;}

.switch-label {
    position: relative;
    top: 0;
    text-align: center;
    cursor: pointer;
    span {
        display: inline-block;
        width: 70px;
        padding: 4px;
    }
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 30px;
    width: 70px;
    left: 0;
    bottom: 0;
    background-color: $border-color;
    border: none;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;    
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:focus + .slider {
    box-shadow: 0 0 1px $border-color;
}

input:checked + .slider:before {
    -webkit-transform: translateX(70px);
    -ms-transform: translateX(70px);
    transform: translateX(70px);
}

</style>

