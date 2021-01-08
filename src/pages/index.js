import Head from 'next/head'
import { useState } from "react"
import CountriesTable from '../components/countriesTable/CountriesTable'
import Layout from '../components/layout/Layout'
import SearchInput from '../components/searchinput/SearchInput'
import styles from '../styles/Home.module.css'

export default function Home({ countries }) {

  const [keyward, setKeyward] = useState("");

  const filterCountries = countries.filter((country) => (
    country.name.toLowerCase().includes(keyward) ||
    country.region.toLowerCase().includes(keyward) ||
    country.subregion.toLowerCase().includes(keyward)
  ))

  const onInputChange = (e) => {
    e.preventDefault();
    setKeyward(e.target.value.toLowerCase());
  }

  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}>Found {countries.length} countries</div>
        <div className={styles.input}>
          <SearchInput placeholder="Filter by Name , Region Or Subregion" onChange={onInputChange} />
        </div>
      </div>
      <CountriesTable countries={filterCountries} />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const countries = await res.json();

  return {
    props: {
      countries,
    },
  };
}
