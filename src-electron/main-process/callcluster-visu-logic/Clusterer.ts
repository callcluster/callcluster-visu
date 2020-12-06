import { spawn } from "child_process";
import { Call, Community } from "./types";
export async function runClustering(subgraph:Call[]):Promise<Community>{
    return new Promise((resolve,reject)=>{
        console.log("about to spawn process")
        const python = spawn('python', ['public/clustering.py']);

        console.log("spawning the process!")
        python.stdin.write(JSON.stringify(subgraph))
        python.stdin.end()
        python.stdout.on('data',function(data){
            const commnityJson=data.toString('utf8')
            resolve(JSON.parse(commnityJson))
        });
        python.stderr.on('data',function(data){
            reject(data.toString('utf8'))
        });
    })
    
}