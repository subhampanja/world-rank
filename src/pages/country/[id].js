import { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import styles from "./country.module.css";
import Link from "next/link"

const getCountry = async (id) => {
    const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}`);

    const country = await res.json();
    return country
}

const Country = ({ country }) => {
    const [border, setBorder] = useState([]);

    const getBorders = async () => {
        const borders = await Promise.all(country.borders.map((border) => getCountry(border)));
        setBorder(borders);
    }

    useEffect(() => {
        getBorders();
    }, [])


    return (
        <Layout title={country.name}>
            <div className={styles.container}>

                <div className={styles.container_left}>
                    <div className={styles.overview_panel}>
                        <img src={country.flag} alt={country.name} />

                        <h1 className={styles.overview_name}>{country.name}</h1>
                        <div className={styles.overview_region}>{country.region}</div>

                        <div className={styles.overview_numbers}>
                            <div className={styles.overview_population}>
                                <div className={styles.overview_value}>{country.population}</div>
                                <div className={styles.overview_label}>Population</div>
                            </div>
                            <div className={styles.overview_area}>
                                <div className={styles.overview_value}>{country.area}</div>
                                <div className={styles.overview_label}>Area</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.container_right}>
                    <div className={styles.details_panel}>
                        <h4 className={styles.details_panel_heading}>Details</h4>
                        <div className={styles.details_panel_row}>
                            <div className={styles.details_panel_label}>Capital</div>
                            <div className={styles.details_panel_value}>{country.capital}</div>
                        </div>
                        <div className={styles.details_panel_row}>
                            <div className={styles.details_panel_label}>Languages</div>
                            <div className={styles.details_panel_value}>{country.languages.map(({ name }) => name).join(", ")}</div>
                        </div>
                        <div className={styles.details_panel_row}>
                            <div className={styles.details_panel_label}>currencies</div>
                            <div className={styles.details_panel_value}>{country.currencies.map(({ name }) => name).join(", ")}</div>
                        </div>
                        <div className={styles.details_panel_row}>
                            <div className={styles.details_panel_label}>Native Name</div>
                            <div className={styles.details_panel_value}>{country.nativeName}</div>
                        </div>
                        <div className={styles.details_panel_row}>
                            <div className={styles.details_panel_label}>gini</div>
                            <div className={styles.details_panel_value}>{country.gini} %</div>
                        </div>
                        <div className={styles.details_panel_borders}>
                            <div className={styles.details_panel_borders_label}>Neighbouring Countries</div>

                            <div className={styles.details_panel_borders_container}>
                                {
                                    border.map(({ flag, name, alpha3Code }) => (
                                        <Link href={`/country/${alpha3Code}`}>
                                        <div className={styles.details_panel_borders_country}>
                                            <img src={flag} alt={name} />
                                            <div className={styles.details_panel_borders_name}>
                                                {name}
                                            </div>
                                        </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default Country;

export const getStaticPaths = async () => {
    const res = await fetch("https://restcountries.eu/rest/v2/all");
    const countries = await res.json();

    const paths = countries.map((country) => ({
        params : {id: country.alpha3Code},
    }));

    return {
        paths,
        fallback: false
    };
};
export const getStaticProps = async ({ params }) => {
    const country = await getCountry(params.id);
    return {
        props: {
            country,
        },
    }
}