# Investments and Holdings
## Requirements

- An admin is able to generate a csv formatted report showing the values of all user holdings
    - The report should be sent to the `/export` route of the investments service
    - The investments service expects the csv report to be sent as json
    - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
    - The holding should be the name of the holding account given by the financial-companies service
    - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)

## Deliverables
**Please make sure to update the readme with**:

- Relating to the task please add answers to the following questions;
    1. How might you make this service more secure?
        - implement use of API key 
        - change from http to https
        - monitor libraries that are being used
    2. How would you make this solution scale to millions of records?
        - implement external database
        - much more robust testing 
        - make frameworks and libraries consistent 
        - pagination and filtering functionality of final data 
    3. What else would you have liked to improve given more time?
        - refactor 'convertInvestmentsToCSV' function
        - unit tests for each function 
        - switch to ES modules (import, export etc) and incorporate cleaner file structure (file for endpoints, file for manipulating data, index.js calling minimal functions)
        
## Getting Started

1. To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

1. Fork and clone the repo
2. Install all dependencies using: npm install
3. Run the unit tests using: npm test -- index.test.js
5. Run the program using: npm start

### Existing routes

Investments - localhost:8081
- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082
- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083
- `/investments/:id` get an investment record by id
- `./finalData` converts data to csv and posts to /investments/export
