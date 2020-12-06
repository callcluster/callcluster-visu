import sys
import json
import random
calls=json.loads(sys.stdin.read())
functions=set()
for call in calls:
    functions.add(call["from"])
    functions.add(call["to"])

community_1=[]
community_2=[]

for function_id in functions:
    if random.choice([1,2])==1:
        community_1.append(function_id)
    else:
        community_2.append(function_id)

print(json.dumps({
    "name":"clustering",
    "functions":[],
    "communities":[
        {
            "name":"community_1",
            "functions":community_1,
            "communities":[]
        }, {
            "name":"community_2",
            "functions":community_2,
            "communities":[]
        }
    ]
}))

sys.stdout.flush()
