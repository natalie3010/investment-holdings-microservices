const express = require("express");
const bodyParser = require("body-parser");
const config = require("../config/default.json");
const request = require("request");
const investmentData = require("../../investments/src/data.json");
const axios = require("axios");
const R = require("ramda");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.post("/finalData", (res) => {
  const getInvestments = async () => {
    try {
      const response = await axios.get(
        `${config.investmentsServiceUrl}/investments`
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanyById = async (id) => {
    try {
      const response = await axios.get(
        `${config.companiesServiceUrl}/companies/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const companyName = async (id) => {
    const data = await getCompanyById(id);
    const companyName = data.name;
    return companyName;
  };

  const convertInvestmentsToCSV = async () => {
    const i = await getInvestments();

    const newArray = i.map(({ id, ...keepAttrs }) => keepAttrs);
    const header = Object.keys(newArray[0]);
    header.push("company");

    /*********** attempt using Ramda ************/
    const testToCSV = R.pipe(
      R.map(R.unwind("holdings")),
      R.unnest,
      R.map(
        (i) =>
          `${i.userId},${i.firstName},${i.lastName},${i.date},${companyName(
            i.holdings.id
          )},${i.investmentTotal * i.holdings.investmentPercentage}`
      ),
      R.join("\r\n")
    );
    const bodyText = testToCSV(i);
    const testing = R.concat([header], [bodyText]);
    console.log(testing);

    /*************** attempt otherwise ******************/

    let csv = newArray.map((row, index) => {
      return header.map((fieldName) => {
        if (fieldName === "holdings") {
          const percentage = newArray[index].holdings.map(
            (el) => el.investmentPercentage
          );
          for (const x of percentage) {
            const l = newArray[index].investmentTotal;
            row = l * x;
            return row;
          }
        }
        if (fieldName === "company") {
          //console.log(nameData)
        }
        const returnVal = JSON.stringify(row[fieldName]);
        return returnVal;
      });
    });
    csv.unshift(header.join(","));
    csv = csv.join("\r\n");
    console.log(csv);
    return csv;
  };

  const finalData = convertInvestmentsToCSV();

  const postData = async (dataToPass) => {
    try {
      const res = await axios.post({
        url: `${config.investmentsServiceUrl}/investments/export`,
        data: dataToPass,
        headers: {
          "Content-Type": "text/csv",
        },
      });
      console.log(res.status);
    } catch (error) {
      console.log(error);
    }
  };

  postData(finalData);
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});

module.exports = app;
