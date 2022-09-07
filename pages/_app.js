import 'react-perfect-scrollbar/dist/css/styles.css';
import 'antd/dist/antd.css'
import 'bootstrap/scss/bootstrap.scss'
import 'nprogress/nprogress.css'
import "@fontsource/nunito";
import '../styles/app.scss'
import {Fragment, useEffect, useState} from "react";
import NProgress from 'nprogress';
import {Router, useRouter} from "next/router";
import RouteLoader from "../components/common/preloader";
import Head from "next/head";
import SiteContext from "../contexts/site";
import {fetchSiteSettings} from "../helpers/backend_helper";

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({Component, pageProps}) => {
    let Layout = Component.layout || Fragment
    const [settings, setSettings] = useState()
    const router = useRouter()

    useEffect(() => {
        fetchSiteSettings().then(({error, data}) => {
            if(error === false) {
                setSettings(data)
                if(!data) {
                    router.push('/setup')
                }
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>{settings?.site_title}</title>
                <link rel='manifest' href='/manifest.json' />
            </Head>
            <RouteLoader/>
            <SiteContext.Provider value={settings}>
                <Layout>
                    <Component {...pageProps}/>
                </Layout>
            </SiteContext.Provider>
        </>
    )
}
export default App