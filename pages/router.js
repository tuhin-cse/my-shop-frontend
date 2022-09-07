import {useEffect} from "react"
import {useRouter} from "next/router";

const Route = () => {
    const router = useRouter()

    useEffect(() => {
        if(window.location.pathname === '/router/') {
            router.push('/')
        } else {
            router.push(window.location.pathname)
        }

    }, [])
    return <></>
}
export default Route