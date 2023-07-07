import { useEffect, useMemo, useState } from "react";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import {
  TbMapSearch,
  TbMoon,
  TbSearch,
  TbSun,

} from "react-icons/tb";
import "./App.css";

import DetailsCard from "./Components/DetailsCard";
import SummaryCard from "./Components/SummaryCard";
import Astronaut from "./asset/not-found.svg";
import SearchPlace from "./asset/search.svg";
import BackgroundColor from "./Components/BackgroundColor";
import Animation from "./Components/Animation";

import axios from "axios";

function App() {
  //Variable declarations
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [noData, setNoData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState();
  const [weatherIcon, setWeatherIcon] = useState(
    `https://openweathermap.org/img/wn/10n@2x.png`
  );
  const [currentLanguage, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [loading, setLoading] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const degreeSymbol = useMemo(
    () => (isFahrenheitMode ? "\u00b0F" : "\u00b0C"),
    [isFahrenheitMode]
  );
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // code logic
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  //setting themee according to device
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setIsDark(event.matches);
      });
  }, [setIsDark]);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const activate = () => {
    setActive(true);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getWeather(searchTerm);
  };

  const getWeather = async (location) => {
    setLoading(true);
    setWeatherData([]);
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;

    const url = "https://api.openweathermap.org/data/2.5/forecast?";
    try {
      let res = await fetch(
        `${url}${how_to_search}&appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`
      );
      let data = await res.json();
      if (data.cod !== "200") {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setTimeout(() => {
          setLoading(false);
        }, 500);
        return;
      }
      setWeatherData(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setCity(`${data.city.name}, ${data.city.country}`);
      setWeatherIcon(
        `${
          "https://openweathermap.org/img/wn/" + data.list[0].weather[0]["icon"]
        }@4x.png`
      );
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  // For the autocomplete search box- Places List
  const [countries, setCountries] = useState([]);
  const [countryMatch, setCountryMatch] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      let arr = [];
      response.data.forEach((element) => {
        arr.push(element.name.official);
      });
      setCountries(arr);
      console.log(arr);
    };

    loadCountries();
  }, []);

  // console.log(countries);

  const searchCountries = (input) => {
    // const {value}=input.target;
    setSearchTerm(input);

    if (!input) {
      // created if-else loop for matching countries according to the input
      setCountryMatch([]);
    } else {
      let matches = countries.filter((country) => {
        // eslint-disable-next-line no-template-curly-in-string
        const regex = new RegExp(`${input}`, "gi");
        // console.log(regex)
        return country.match(regex) || country.match(regex);
      });
      setCountryMatch(matches);
    }
    // console.log(countryMatch);
  };

  // load current location weather info on load
  window.addEventListener("load", function () {
    navigator.geolocation.getCurrentPosition(myIP);
  });

  return (
    <div className="container">
      <div
        className="blur"
        style={{
          background: `${
            weatherData ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "-10%",
          right: "0",
        }}
      ></div>
      <div
        className="blur"
        style={{
          background: `${
            weatherData ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "36%",
          left: "-6rem",
        }}
      ></div>

      <div className="content">
        <div className="form-container">
          <div className="name">
            <Animation />
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />
              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>
            </div>
            <div className="city">
              <TbMapSearch />
            </div>
          </div>

          <div className="search">
            <h2
              style={{
                marginRight: currentLanguage === "es" || "fr" ? "10px" : "0px",
                color: `${isDark ? "#fff" : "#333"}`,
              }}
            >
            </h2>

            <hr
              style={{
                borderBottom: `${
                  isDark ? "3px solid  #fff" : "3px solid #333"
                }`,
              }}
            />

            <form className="search-bar" noValidate onSubmit={submitHandler}>
              <input
                onClick={activate}
                placeholder={active ? "" : "Explore cities weather"}
                onChange={(e) => searchCountries(e.target.value)}
                required
                className="input_search"
              />

              <button className="s-icon">
                <TbSearch
                  onClick={() => {
                    navigator.geolocation.getCurrentPositon(myIP);
                  }}
                />
              </button>
            </form>
          </div>
        </div>
        <div className="info-container">
          <div className="info-inner-container">
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="fahrenheit-checkbox"
                onChange={toggleFahrenheit}
              />
              <label htmlFor="fahrenheit-checkbox" className="label">
                <RiFahrenheitFill />
                <RiCelsiusFill />
                <div className="ball" />
              </label>
            </div>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span>
              {weatherData.length === 0 ? (
                <div className="nodata">
                  {noData === "Location Not Found" ? (
                    <>
                      <img
                        src={Astronaut}
                        alt="an astronaut lost in the space"
                      />
                      <p>Oh oh! We're lost in space finding that place.</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={SearchPlace}
                        alt="a person thinking about what place to find"
                      />
                      <p style={{ padding: "20px" }}>
                        Don't worry, if you don't know what to search for, try:
                        India or maybe USA.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <DetailsCard
                    weather_icon={weatherIcon}
                    data={weatherData}
                    soundEnabled={backgroundSoundEnabled}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />
                  <h1 className="title centerTextOnMobile">
                  </h1>
                  <ul className="summary">
                    {weatherData.list.map((days, index) => (
                      <SummaryCard
                        key={index}
                        day={days}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                      />
                    ))}
                  </ul>
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
