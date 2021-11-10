import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Infobox from "./components/Infobox/Infobox";
import Map from "./components/Map/Map";
import Table from "./components/Table/Table";
import LineGraph from "./components/LineGraph/LineGraph";
import { sortData } from "./components/utils";

function App() {
  const [countries, setCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const url = "https://disease.sh/v3/covid-19/all";

    axios.get(url).then((res) => {
      setCountryInfo(res.data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          let data = res.data;
          const countries = data.map((item) => ({
            name: item.country, //get full country name ex United Kingdom, United States ,France
            value: item.countryInfo.iso2, //get iso country name ex : UK,USA,FR
          }));
          const sortedData = sortData(res.data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const handselectedCountry = async (e) => {
    const countryCode = e.target.value;
    setCountrySelected(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await axios.get(url).then((res) => {
      setCountrySelected(countryCode);
      setCountryInfo(res.data);
    });
  };

  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 tacker </h1>
          <FormControl>
            <Select
              variant="outlined"
              value={countrySelected}
              onChange={handselectedCountry}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <Infobox
            title="Coronavirus Cases "
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <Infobox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <Infobox
            title="Deaths"
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          />
        </div>

        {/**Map */}
        <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Case by Country</h3>
          {/**Table*/}
          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
          {/**Graph */}
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
