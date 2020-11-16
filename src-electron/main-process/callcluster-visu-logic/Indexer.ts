export default class Indexer<T> {
    index:T[]=[]
    get nextId():number{
        return this.index.length;
    }
    add(elem:T){
        this.index.push(elem);
    }
    get(id:number):T{
        return this.index[id]; 
    }
}