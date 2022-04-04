import { useRouter } from 'next/router';
import React from 'react';
import AppLayout from '../../Components/AppLayout';
import env from '../../lib/env';
import { fetchHandler } from '../../lib/fetch';
import cityData from '../../data/city.json';

// getStaticPaths
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

// getStaticProps with ISR
export const getStaticProps = async ({ params }) => {
  let city;
  if (cityData && env.NODE_ENV !== 'development') {
    city = cityData;
  } else {
    const { resData } = await fetchHandler({
      url: `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${params.id}?apikey=${env.API_KEY}`,
      options: {
        method: 'GET'
      }
    });
    city = resData;
    if (city?.Code == 'ServiceUnavailable') {
      city = cityData;
    }
    // console.log({ city });
  }
  return {
    props: {
      city
    },
    revalidate: 60
  };
};

export default function city({ city }) {
  const router = useRouter();
  // Render city...
  if (router.isFallback) {
    return (
      <AppLayout>
        <main className="grid place-content-center h-[70vh]">
          <h1 className="text-muted text-2xl">Loading...</h1>
        </main>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <main>
        <section className="py-6">
          <div className="text-lg font-semibold ">{city?.Headline.Text}</div>
          <div className="mb-4 mt-2  text-sm text-muted">
            {new Date(city?.Headline.EffectiveDate).toDateString()}
          </div>
          <div className="flex flex-col gap-4">
            {city?.DailyForecasts.length > 0 &&
              city?.DailyForecasts.map((df, index) => (
                <div
                  key={index}
                  className="bg-white px-8 py-6 rounded-md shadow-sm grid sm:grid-cols-5 items-center">
                  <div className="sm:col-span-1">
                    <div className="flex gap-2 items-center text-muted justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="uppercase">
                        {new Date(df.Date).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-3 text-center mt-8 md:mt-0">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="flex gap-1 items-center">
                        <h2 className="text-2xl font-semibold">
                          {df.Temperature.Maximum.Value} F
                        </h2>
                        <h1>~</h1>
                        <h2 className="text-2xl font-semibold">
                          {df.Temperature.Minimum.Value} F
                        </h2>
                      </div>
                      <div className="flex gap-2 flex-wrap    capitalize text-lg text-muted mt-1">
                        <p>Day - {df.Day.IconPhrase},</p>
                        <p>Night - {df.Night.IconPhrase}</p>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <div className="flex gap-2 items-center text-muted justify-end">
                      <a href={df.Link} className="uppercase text-sm">
                        more details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
