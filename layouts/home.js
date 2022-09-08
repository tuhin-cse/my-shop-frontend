import {useFetch} from "../helpers/hooks";
import {fetchProfile} from "../helpers/backend_helper";
import Link from "next/link";
import {useSite} from "../contexts/site";
import {useEffect, useState} from "react";

const HomeLayout = ({children}) => {
    const settings = useSite()
    const [user] = useFetch(fetchProfile)

    const [host, setHost] = useState('')
    useEffect(() => {
        setHost(window?.location?.hostname)
    }, [])

    return (
        <>
            <main className="home-layout">
                <div className="container">
                    <header className="h-20 flex justify-between items-center header">
                        {settings?.logo ? (
                            <img src={settings?.logo} alt="" className="h-20"/>
                        ) : (
                            <h2 className="text-lg font-semibold text-gray-600">{settings?.shop_name}</h2>
                        )}
                        <ul className="menu">
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/balance">Balance</Link>
                            </li>
                            {!!user ? (
                                <>
                                    <li>
                                        <Link href="/admin">Dashboard</Link>
                                    </li>
                                    <li onClick={() => {
                                        localStorage.removeItem('authToken')
                                        window.location.href = "/"
                                    }}>
                                        <a>Logout</a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/login">Login</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </header>
                    {children}
                    <hr/>
                    <footer className="py-3 text-gray-500 text-sm flex justify-between">
                        <p>  {settings?.site_footer} <a className="text-primary"
                                                        href={host || ""}>{settings?.site_name}</a>
                        </p>
                        <ul className="menu">
                            <li>{settings?.site_email}</li>
                            <li>{settings?.site_phone}</li>
                            <li>{settings?.address}</li>
                        </ul>
                    </footer>
                </div>
            </main>
        </>
    )
}
export default HomeLayout
