#!/bin/bash
# docker-compose --profile dev build
# docker-compose --profile dev up -d
echo "Wainting for swagger file"
api_url=http://localhost:8000/nest
echo ${api_url}/api-json/;
while ! curl --output /dev/null --silent --head --fail $api_url/api-json/; do
 sleep 1 && echo -n .;
done;
echo "Downloading swagger file"
curl --silent $api_url/api-json/ -o swagger.json
echo "generating .ts from swagger"
npx swagger-typescript-api -p ./swagger.json -o ./client-ui -n index.ts -t ./swagger/templates/default --union-enums <<-EOF
y
EOF