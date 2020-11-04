export default class Indexer {
    index=[]
    get nextId(){
        return this.index.length;
    }
    add(elem){
        this.index.push(elem);
    }
    get(id){
        return this.index[id]; 
    }
}