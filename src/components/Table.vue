<template>
    <table>
        <thead>
            <tr>
                <slot name="header"/>
            </tr>
        </thead>
        <tbody>
            <slot name="body"/>
        </tbody>        
    </table>
</template>
<style lang="scss" scoped>
@import "@/assets/css/_color.scss";
table {
    border-collapse: collapse;
    border: 1px solid $border-color;
    width: 100%;
}
td, th {
    border: 1px solid $border-color;
    border-left: 0;
    border-right: 0;
    padding: 12px 8px;
    text-align: center;
}
th {
    background-color: rgb(231, 228, 228);
    border-bottom-width: 2px;
}
tr:nth-child(even) {
    background-color: #eee;
}
@media only screen and (max-width: 414px) {
    table {
        border-left: 0;
        border-right: 0;
    }
    th {
        font-size: 0.8em;
    }
}
</style>
