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
import { sortData, prettyPrintStat } from "./components/utils";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapcenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
          setMapCountries(data);
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
    /* await axios.get(url).then((res) => {
      const data = res.data;

      setCountrySelected(countryCode);
      setCountryInfo(data);
      setMapcenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(5);
    });*/
    const data = await axios.get(url);
    setCountrySelected(countryCode);
    setCountryInfo(data.data);
    setMapcenter([data.data.countryInfo.lat, data.data.countryInfo.long]);
    setMapZoom(4);
  };

  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid 19 tacker </h1>
          <FormControl className="app_dropdown">
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
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Infected "
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <Infobox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        {/**Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Case by Country</h3>
          {/**Table*/}
          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
          {/**Graph */}
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
