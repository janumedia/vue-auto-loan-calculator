<template>
    <div class="custom-input">
        <label>{{ label }}</label>
        <div class="input-container">
            <span class="prefix" v-if="prefix">{{ prefix }}</span>
            <input :type="inputType" :pattern="inputPattern" :class="prefix ? 'has-prefix' : sufix ? 'has-sufix' : ''" @input="handleInput" @blur="handleBlur" v-model="content">
            <span class="sufix" v-if="sufix">{{ sufix }}</span>
            <span class="text-error">{{ errorText }}</span>
        </div>
    </div>
</template>
<script>
import { isMobile } from '@/utils/Utils'
export default {
    props: {
        type:String,
        label:String,
        prefix:String,
        sufix:String,
        value: [Number, String],
        inValid: Function
    },
    data() {
        return {
            errorText: ""
        }
    },
    computed: {
        inputType() {
            switch(this.type.toLowerCase()) {
                case 'date':
                    return 'text';
                case 'number':
                    return isMobile() ? 'tel' : this.type;
                default:
                    return this.type;
            }
        },
        inputPattern() {
            const type = this.type.toLowerCase();
            if(type == 'number') return '^[0-9]*$';
            if(type == 'date') return '^[0-9\/\\]*$';
            return '';
        },
        content:{
            get: function() {
                return this.value;
            },
            set: function(newValue) {
                //handled with $emit
            }
        }
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value);
        },
        handleBlur(e) {
            if(typeof this.inValid === 'function' && this.inValid()) {
               this.$el.classList.add('custom-input--error');
               this.errorText = this.inValid();
               return;
            }
            this.$el.classList.remove('custom-input--error');
            this.errorText = "";
            this.$emit('blur', this);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
.custom-input {
    color: $secondary-text;
}
.input-container {
    position: relative;
}
.prefix, .sufix, input {
    font-size: 1.2em;
    font-weight: bold;
}
.prefix, .sufix {
    position: absolute;
    top: 8px;
}
.sufix {
    right: 0px;
}
input {
    color: $secondary-text;
    width: 100%;
    height: 40px;
    margin-bottom: 24px;
    padding: 0.4em 0;// 0.4em 15px;
    border:0;
    border-bottom:1px solid $border-color;
    background-color: inherit;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    -webkit-appearance: none; /* ios shadow removed */
    -moz-appearance:none;
    box-shadow:none;
    transition: 0.4s;
    &:focus {
        border-bottom: 2px solid $primary;
    }
    &.has-prefix {
        padding: 0.4em 0 0.4em 15px;
    }
    &.has-sufix {
        padding: 0.4em 20px 0.4em 0;
    }
}
.text-error {
    display: block;
    color: $error;
    visibility: hidden;
}
.custom-input--error {
    input {
        color: $error;
        border-bottom: 2px solid $error;
        margin-bottom: 8px;
    }
    .text-error {
        visibility: visible;
        margin-bottom: 10px;
    }
}
</style>

