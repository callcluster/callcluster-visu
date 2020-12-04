export default class Indexer<T> {
    index:(T|null)[]=[]
    get nextId():number{
        return this.index.length;
    }
    add(elem:T){
        this.index.push(elem);
    }
    get(id:number):T{
        const ret = this.index[id];
        if(ret==null){
            throw new Error("It is not added!")
        }
        return ret;
    }
    remove(id:number){
        this.index[id]=null
    }
}