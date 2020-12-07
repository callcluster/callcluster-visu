import { spawn } from "child_process";
import { Call, Community } from "./types";
export async function runClustering(subgraph:Call[]):Promise<Community>{
    return new Promise((resolve,reject)=>{
        console.log("about to spawn process")
        const python = spawn('python', ['public/clustering.py']);

        console.log("spawning the process!")
        python.stdin.write(JSON.stringify(subgraph))
        python.stdin.end()
        let allData=""
        python.stdout.on('data',function(data){
            allData+=data.toString('utf8')
            
        });
        python.stdout.on('end',()=>{
            resolve(JSON.parse(allData))
        })
        python.stderr.on('data',function(data){
            reject(data.toString('utf8'))
        });
    })
    
}