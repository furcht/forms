Rexus.forms.validation("baseEvents", {
    "evtTitle": (val)=>{
        if(/^[a-zA-Z0-9 ]{3,}$/.test(val)) return true;
        return "Title should have 3 or more characters."
    },
    "evtDesc": (val)=>{
        if(val.length<=200) return true;
        return "Please keep description to 200 characters or less"
    },
    "evtStartDate": (val)=>{
        let dateFormat = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/.test(val);
        if(dateFormat) return true;
        return "Please use a valid date format YYYY-MM-DD"
    },
    "evtEndDate": (val)=>{
        let dateFormat = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/.test(val);
        if(dateFormat) return true;
        return "Please use a valid date format YYYY-MM-DD"
    },
    "evtStartTime": (val)=>{
        let timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
        if(timeFormat) return true;
        return "Please use a valid time format HH:MM (24hr)"
    },
    "evtEndTime": (val)=>{
        let timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
        if(timeFormat) return true;
        return "Please use a valid time format HH:MM (24hr)"
    },
    "evtRecurrence": (val, obj)=>{
        if(
            obj.evtRecSun ||
            obj.evtRecMon ||
            obj.evtRecTue ||
            obj.evtRecWed ||
            obj.evtRecThu ||
            obj.evtRecFri ||
            obj.evtRecSat
        ) return true;
        return "Please select a day for the event to recur"
    },
    "evtOnline": (val)=>{
        if(val.length>1) return true;
        return "Please select an option"
    },
    "evtOffsiteAddress": (val)=>{
        if(/\d+.+/.test(val)) return true;
        return "Please us a valid US Address"
    },
    "evtOffsiteZip": (val)=>{
        if(/^\d{5}$/.test(val)) return true;
        return "Please use a valid US Zip Code"
    }
});




    /*
    == SUMMARY ==
    evtTitle: "Some Title"

    == LOCATION ==
    IF: evtOnsite: false
        evtOffsiteAddress: "5882 California Avenue"
        evtOffsiteCity: "Long Beach"
        evtOffsiteState: "CA"
        evtOffsiteZip: "90805"
    ELSE:
        '5722 Lime Avenue, Long Beach, CA 90805'

    == DESCRIPTION ==
    evtDesc: "Details"

    == START ==
    evtStartDate: "2022-04-26"
    evtStartTime: "23:40"

    == END ==
    IF: evtMultiDay: true
        evtEndDate: "2022-04-30"
        evtEndTime: "23:45"
    ELSE:
        -- START --

    == RECURRANCE ==
    IF: evtNoRepeat: false
        evtRecurrence: "weekly"
        evtRecFri: false
        evtRecMon: false
        evtRecSat: false
        evtRecSun: false
        evtRecThu: true
        evtRecTue: true
        evtRecWed: false

    == EXTRA ==
    evtChildcareAvail: false
    evtFoodAvail: false
    evtOnline: "none"
    */

    // for(a; a>=0; a--) {
    //     key = keys[a];
    //     if(ruleset[key]) validationMsg = ruleset[key](inputValues[key]);
    //     if(validationMsg) output.push(validationMsg)
    // }
    // return output;
