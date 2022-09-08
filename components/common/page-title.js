import Head from "next/head";
import {useSite} from "../../contexts/site";

const PageTitle = ({title, breadcrumbs = [], appTitle, hidden = false}) => {
    const site = useSite()

    return (
        <>
            <Head>
                <title>{appTitle || title} | {site?.shop_name}</title>
            </Head>
            <div className="flex justify-between item-center mb-3"
                 style={{display: hidden ? 'none' : 'block'}}>
                <h1 className="text-xl font-semibold text-gray-600 tracking-wider">{title}</h1>
                {/*<ul className="hidden sm:block">*/}
                {/*    {breadcrumbs?.map((item, index) => (*/}
                {/*        <li key={index} className="inline-block text-sm text-gray-500">*/}
                {/*            {index + 1 < breadcrumbs?.length ? (*/}
                {/*                <Link href={item?.href || '#!'}>*/}
                {/*                    <a className="text-main">{item?.label} /&nbsp;</a>*/}
                {/*                </Link>*/}
                {/*            ) : item?.label}*/}
                {/*        </li>*/}
                {/*    ))}*/}
                {/*</ul>*/}
            </div>
        </>
    )
}
export default PageTitle