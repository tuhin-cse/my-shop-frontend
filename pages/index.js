import HomeLayout from "../layouts/home";
import {useSite} from "../contexts/site";
import Link from "next/link";
import Head from "next/head";

const Home = () => {
    const settings = useSite()

    return (
       <>
           <Head>
               <title>{settings?.site_name}</title>
           </Head>
           <div className="py-4 md:py-12 flex">
               <div className="w-full md:w-1/2">
                   <h1 className="text-5xl font-semibold mb-2 max-w-md">Welcome to {settings?.site_name}</h1>
                   <p className="text-lg mb-3">Financial and Logistical Solutions.</p>
                   <Link href="/login">
                       <a className="btn btn-primary">Login</a>
                   </Link>
               </div>
               <div className="w-full md:w-1/2">
                   <img src="/img/screenshot.png" alt=""/>
               </div>
           </div>
       </>
    )
}
Home.layout = HomeLayout
export default Home

