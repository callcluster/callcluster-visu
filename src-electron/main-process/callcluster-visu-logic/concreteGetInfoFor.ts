import Analysis from "./Analysis";
import getInfoFor, { InfoQuery } from "./getInfoFor";

function concreteGetInfoFor(data:InfoQuery){
    return getInfoFor(data, new Analysis())
}

export { concreteGetInfoFor as getInfoFor }