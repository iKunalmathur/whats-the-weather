import React, { useState } from 'react';
import Link from 'next/link';
import env from '../lib/env';
import AppLayout from '../Components/AppLayout';
import citiesData from '../data/cities.json';

const fetchHandler = async (config) => {
  let resData, resStatus, resErrors;
  try {
    const res = await fetch(config.url, {
      ...config.options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    resData = await res.json();
    resStatus = res.status;
  } catch (err) {
    resErrors = err;
    // console.log(err);
  }
  return { resData, resStatus, resErrors };
};

// getStaticProps with ISR
export const getStaticProps = async () => {
  let cities;
  if (citiesData && env.NODE_ENV === 'development') {
    cities = citiesData;
  } else {
    const { resData } = await fetchHandler({
      url: `http://dataservice.accuweather.com/currentconditions/v1/topcities/50?apikey=${env.API_KEY}`,
      options: {
        method: 'GET'
      }
    });
    cities = resData;
    if (cities?.Code == 'ServiceUnavailable') {
      cities = citiesData;
    }
    // console.log({ cities });
  }

  return {
    props: {
      cities
    },
    revalidate: 60
  };
};

export default function index({ cities }) {
  const [limit, setLimit] = useState(9);
  const [result, setResult] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const term = e.target.term.value;
    if (term.length == 0) {
      setResult([]);
      // 'Please enter a city name'
      return;
    }
    // console.log({ term });
    const findRes = cities.filter((city) => {
      return city.LocalizedName.toLowerCase().includes(term.toLowerCase());
    });
    if (findRes.length > 0) {
      setResult(findRes);
      e.target.term.value = '';
    }
  };
  return (
    <AppLayout>
      <main>
        {/* search */}
        <section>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name="term"
              id="city"
              className="px-4 py-3 rounded-md border-2 flex-1"
              placeholder="e.g. New york"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-black text-white rounded-md flex items-center justify-center ">
              Search
            </button>
          </form>
        </section>
        {/* Search Result */}
        <section className={result.length > 0 ? 'py-6' : ''}>
          <h2 className="mb-4">
            {result.length > 0 ? result.length + ' Search Results' : ''}
          </h2>
          {/* 3 col grid tailwind */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* city card */}
            {result?.length > 0 &&
              result.map((city, index) => (
                <Link key={index} href={`/cities/${city?.Key}`}>
                  <a className="sm:col-span-1 relative bg-white shadow-sm p-6 rounded-md">
                    <div className="">
                      <h2 className="text-lg font-semibold">
                        {city?.EnglishName}
                      </h2>
                      <div className="flex gap-2 text-xs uppercase text-muted mt-1">
                        <p>current weather</p>
                        <p>{city?.WeatherText}</p>
                        <p>
                          {new Date(
                            city?.LocalObservationDateTime
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="border-b py-2">
                        Temperature : {city?.Temperature.Metric.Value} c
                      </p>
                      <p className="py-2">
                        Country : {city?.Country.EnglishName}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
        </section>
        {/* Top cities */}
        <section className={result.length > 0 ? 'hidden' : 'py-6'}>
          <h2 className="mb-4"> Top 50 Cities</h2>

          {/* 3 col grid tailwind */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* city card */}
            {cities?.length > 0 &&
              cities.slice(0, limit).map((city, index) => (
                <Link key={index} href={`/cities/${city?.Key}`}>
                  <a className="sm:col-span-1 relative bg-white shadow-sm p-6 rounded-md">
                    <div className="">
                      <h2 className="text-lg font-semibold">
                        {city?.EnglishName}
                      </h2>
                      <div className="flex gap-2 text-xs uppercase text-muted mt-1">
                        <p>current weather</p>
                        <p>{city?.WeatherText}</p>
                        <p>
                          {new Date(
                            city?.LocalObservationDateTime
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="border-b py-2">
                        Temperature : {city?.Temperature.Metric.Value} c
                      </p>
                      <p className="py-2">
                        Country : {city?.Country.EnglishName}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
          </div>
          <div className="flex justify-center py-6">
            <button
              className="px-3 py-2 bg-black text-white rounded-md flex items-center justify-center"
              onClick={() => setLimit(limit + 3)}>
              Load more
            </button>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
