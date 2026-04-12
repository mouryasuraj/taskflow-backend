import { parseISO } from "date-fns"

export const validateDate = (date)=>{
    const inputDate = parseISO(date)
    let a={}

    if(!isValid(inputDate)){
        a.err = "Invalid date format"
    }
    a.date = inputDate
    return a
}