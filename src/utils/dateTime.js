const addDays = (date, days) => {
    dateObject = new Date(date);
    dateObject.setDate(dateObject.getDate() + days);
    return dateObject.toISOString();
}

const getDays = (checkInTime,checkOutTime) => {
    checkInDate = new Date(checkInTime);
    checkOutDate = new Date(checkOutTime)
    diff = checkOutDate-checkInDate
    if(diff<=0 || isNaN(diff)){
        return NaN;
    }
    else{
        console.log(checkOutTime);
        console.log(checkInTime);
        console.log(diff);
        var days = (Math.ceil((checkOutDate-checkInDate)/(1000*60*60*24)));
        //console.log(days);
        return days;
    }
}

module.exports = {
    addDays,
    getDays
}