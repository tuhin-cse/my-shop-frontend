import MetisMenu from '@metismenu/react';
import 'metismenujs/dist/metismenujs.css';
import Link from 'next/link'
import {Fragment, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSite} from "../../contexts/site";

const Sidebar = ({menu}) => {

    const {pathname} = useRouter()
    const isActive = (item) => {
        if (item?.href === pathname || item?.childHrefs?.includes(pathname)) {
            return true
        }
        let find = item?.child?.find(child => child.href === pathname || child?.childHrefs?.includes(pathname))
        return !!find
    }

    const [update, setUpdate] = useState()
    useEffect(() => {
        setUpdate(!update)
        document.querySelectorAll('.metismenu .sub-menu')?.forEach(menu => {
            menu?.childNodes?.forEach(child => {
                let item = child.childNodes[0]
                if (item.href === window.location.href) {
                    if (!menu.classList.contains('mm-show')) {
                        menu.classList.add('mm-show')
                    }
                }
            })
        })

    }, [pathname])
    const site = useSite()

    const removeMenu = () => {
        try {
            if (window.innerWidth < 1024) {
                document.querySelector('.dashboard')?.classList.remove('mini')
                document.querySelector('.dashboard')?.classList.remove('mobile')
            }
        } catch (e) {

        }
    }

    return (
        <>
            <div className="sidebar-bg" onClick={removeMenu}/>
            <nav className="sidebar">
                <div>
                    <div className="h-16 flex justify-center items-center">
                        <span className="site-title">{site?.shop_name || ''}</span>
                        <span className="site-title-sm">{site?.shop_name?.split(' ')?.map(d => d[0]) || ''}</span>
                    </div>
                    <MetisMenu>
                        {menu?.map((item, index) => {
                            let Icon = item.icon || Fragment
                            return (
                                <li className={`${isActive(item) ? 'mm-active active' : ''}`} key={index}>
                                    {item?.child ? (
                                        <>
                                            <a className={`nav-item has-arrow ${isActive(item) ? item?.child?.length > 0 ? 'p-active' : 'active' : ''}`}>
                                                <Icon className="inline-block"/>
                                                <span>{item.label}</span>
                                            </a>
                                            <ul className="sub-menu">
                                                <li className="label">{item.label}</li>
                                                {item?.child?.map((child, index) => {
                                                    let Icon = child.icon || Fragment
                                                    return (
                                                        <li key={index}>
                                                            <Link href={child.href || '#!'}>
                                                                <a onClick={removeMenu}
                                                                   className={`nav-item ${isActive(child) ? 'active' : ''}`}>
                                                                    <Icon className="inline-block mb-0.5"/>
                                                                    <span> {child.label}</span>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </>
                                    ) : (
                                        <Link href={item.href || '#!'}>
                                            <a className={`nav-item ${isActive(item) ? 'active' : ''}`} onClick={() => {
                                                document.querySelectorAll('.metismenu .sub-menu')?.forEach(menu => {
                                                    menu.classList.remove('mm-show')
                                                })
                                                removeMenu()
                                            }}>
                                                <Icon className="inline-block mb-0.5"/>
                                                <span className="c-tooltip">{item.label}</span>
                                            </a>
                                        </Link>
                                    )}

                                </li>
                            )
                        })}
                    </MetisMenu>
                </div>
            </nav>
        </>
    )
}
export default Sidebar