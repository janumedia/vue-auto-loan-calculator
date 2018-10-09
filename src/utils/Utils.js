const numFormat = (number, curcency='$') => {
    if(number === undefined) return ""
    if(typeof number === "string") number = Number(number)
    //https://stackoverflow.com/a/14428340/1578100
    return `${curcency}${number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}`;
}

const dateFormat = (date, locale) => {
    if(locale) {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    }
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
}

const isMobile = () => {
    //https://stackoverflow.com/a/21742107/1578100
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android/i.test(userAgent) || /iPad|iPhone|iPhone/.test(userAgent) && !window.MSStream
}

export {
    numFormat, 
    dateFormat,
    isMobile
}