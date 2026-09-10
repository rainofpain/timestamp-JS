import express from  "express";
import moment from "moment";

const app = express();

app.get(
    '/timestamp',  
    (req, res) => {
        const timestamp = moment().format('dddd, MMMM D, YYYY');
        res.json(
            {
                timestamp: timestamp
            }
        )
    }
);

app.listen(
    8000,
    () =>{

    }
);