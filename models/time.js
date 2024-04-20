class Time {
    constructor(hours, minutes, part) {
        this.hours = hours,
        this.minutes = minutes,
        this.part = part
    }

    valueOf() {
        if (this.hours == 12 && this.minutes == 0 && this.part == "PM"){
            return this.hours * 60 + this.minutes; 
        }
        if (this.hours == 12 && this.minutes == 0 && this.part == "AM"){
            return (this.hours+12) * 60 + this.minutes; 
        }
        if (this.part == "AM"){
            return this.hours * 60 + this.minutes;
        }else{
            return (this.hours+12) * 60 + this.minutes;
        }
    }
}

module.exports = Time