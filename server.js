const express = require('express');
const app = express();

app.use(express.json());


app.get('/fetchAvailableData', async (req, res) => {
    try {
        let url = 'https://data-collection-fbn6t4.5sc6y6-1.usa-e2.cloudhub.io/api/fetchData?operationalStatus=Operational&customerFacingFlag=true&inCommissionFlag=true'
        let response = await fetch(url, {
            method: 'GET'
        });
        let liftData = [];
        let result = await response.json();
        let tranformedData = result.data.resultSet
        let obj = {}
        for (let i = 0; i < tranformedData.length; i++) {
            if (tranformedData[i].status == 'Available') {
                obj = {
                    "StationName": tranformedData[i].station.name,
                    "CRSCode": tranformedData[i].station.crsCode,
                    "SensorId": tranformedData[i].station.postCode
                },
                    liftData.push(obj)
            }

        }
        let createUrl = 'https://data-collection-fbn6t4.5sc6y6-1.usa-e2.cloudhub.io/api/createAlert';
        let payload = { "LiftData": liftData };

        let createUrlResponse = await fetch(createUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        let createUrlResponseResult = await createUrlResponse.json();
        return res.status(200).send({ message: "Data fetched successfully", data: createUrlResponseResult });

    } catch (error) {
        return res.status(500).send({ message: "Internal server Error", error });

    }


});


app.listen(3000, () => {
    console.log('server is running on port 3000')
});