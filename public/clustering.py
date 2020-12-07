import sys
import json
import random
from igraph import Graph
import leidenalg as la
calls=json.loads(sys.stdin.read())

g = Graph([
    (call["from"],call["to"])
    for call in calls
])
partition = la.find_partition(g, la.ModularityVertexPartition);

json_output=json.dumps({
    "name":"clustering",
    "functions":[],
    "communities":[
        {
            "name":"community_"+str(idx),
            "communities":[],
            "functions":part
        }
        for idx,part in enumerate(partition) if len(part)>1
    ]
},ensure_ascii=False)
sys.stdout.write(json_output)
sys.stdout.flush()
