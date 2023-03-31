const axios = require("axios");
const app = require("../src/index.js");
const config = require("../config/default.json");

jest.mock("axios");

const mockInvestment = {
  id: "1",
  userId: "11",
  firstName: "test-name",
  lastName: "test-last-name",
  investmentTotal: 1000,
  date: "2023-01-01",
  holdings: [{ id: "1", investmentPercentage: 0.5 }],
};

const mockCompany = [
  {
    id: "1",
    name: "test-company-name",
    address: "test-address",
    postcode: "test-postcode",
    frn: "123456",
  },
];

describe("test get investments", () => {
  it("fetches data successfully from API", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(mockInvestment));

    await expect(app.getInvestments()).resolves.toEqual(mockInvestment);

    await expect(axios.get).toHaveBeenCalledWith(
      `${config.investmentsServiceUrl}/investments`
    );
  });
  it("Throws an error when API sends nothing back", async () => {
    const e = "error message";
    axios.get.mockImplementationOnce(() => Promise.reject(new Error(e)));

    await expect(getInvestments()).rejects.toThrow(e);
  });
});

describe("test get company by id", () => {
  it("fetches data successfully from API", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(mockCompany));

    await expect(app.getCompanyById(mockCompany.id)).resolves.toEqual(
      mockCompany
    );

    await expect(axios.get).toHaveBeenCalledWith(
      `${config.companiesServiceUrl}/companies/${mockCompany.id}`
    );
  });
  it("Throws an error when API sends nothing back", async () => {
    const e = "error message";
    axios.get.mockImplementationOnce(() => Promise.reject(new Error(e)));

    await expect(getCompanyById(mockCompany.id)).rejects.toThrow(e);
  });
});
