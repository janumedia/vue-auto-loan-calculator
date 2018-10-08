<template>
    <button @click="handleClick">
        <slot/>
    </button>
</template>
<script>
export default {
    methods: {
        handleClick(e) {
            this.$emit('click', this);
        }
    }
}
</script>
<style lang="scss">
@import "@/assets/css/_color.scss";
button {
    width: 100%;
    height: 50px;
    font-size: 1.6em;
    font-weight: bold;
    border: none;
    border-radius: 25px;
    -webkit-border-radius: 25px;
    -moz-border-radius: 25px;    
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
    &:active {
        color: $primary;
        background-color: $primary-text;
    }
}
@media only screen and (hover:hover) {
    button {
        &:hover {
            color: $primary;
            background-color: $primary-text;
        }
    }
}
</style>

