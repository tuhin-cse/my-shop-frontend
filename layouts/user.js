import Sidebar from "../components/dashboard/sidebar";
import Header from "../components/dashboard/header";
import {
    FaBraille,
    FaGift,
    FaIdCard,
    FaLaptop,
    FaListUl,
    FaNewspaper,
    FaPrint,
    FaShoppingCart,
    FaStar,
    FaTh,
    FaUsers,
    FaWrench
} from "react-icons/fa";
import {useEffect, useState} from "react";
import {fetchProfile} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import UserContext from "../contexts/user";
import {Loader} from "../components/common/preloader";

const UserLayout = ({children}) => {
    const router = useRouter()
    const [user, setUser] = useState()


    useEffect(() => {
        getProfile()
    }, [])


    const getProfile = () => {
        fetchProfile().then(({error, data}) => {
            if (error === false) {
                setUser({...data})
            } else {
                router.push('/login')
            }
        })
    }

    const menu = getMenu(user)

    if (!user) {
        return (
            <div className="loader block">
                <Loader/>
            </div>
        )
    }

    return (
        <UserContext.Provider value={{...user, getProfile}}>
            <div className="dashboard">
                <Sidebar menu={menu}/>
                <Header/>
                <div className="main-content">
                    <div className="w-full sm:px-6 sm:my-4 z-30" style={{minHeight: 400}}>
                        {children}
                    </div>
                </div>
            </div>
        </UserContext.Provider>
    )
}
export default UserLayout


const menu = [
    {
        label: 'Dashboard',
        icon: FaLaptop,
        href: '/admin',
        permission: 'any'
    },
    {
        label: 'Categories',
        icon: FaListUl,
        href: '/admin/categories',
        childHrefs: ['/admin/categories/add', '/admin/categories/[_id]', '/admin/categories/edit/[_id]'],
        permission: 'category_show',
    },
    {
        label: 'Products',
        icon: FaGift,
        child: [
            {
                label: 'Products',
                icon: FaGift,
                href: '/admin/products',
                childHrefs: ['/admin/products/add', "/admin/products/[_id]", "/admin/products/edit/[_id]"],
                permission: "product_show"
            },
            {
                label: 'Barcode',
                icon: FaPrint,
                href: '/admin/products/barcode',
                permission: 'barcode',
            },
        ]
    },
    {
        label: 'POS',
        icon: FaTh,
        href: '/admin/pos',
        permission: "pos"
    },
    {
        label: 'Transactions',
        icon: FaNewspaper,
        href: '/admin/transactions',
        childHrefs: ['/admin/transactions/[_id]'],
        permission: "card_transactions"
    },
    {
        label: 'Stock',
        icon: FaBraille,
        href: '/admin/stock',
        permission: "pos"
    },
    {
        label: 'Purchases',
        icon: FaShoppingCart,
        href: '/admin/purchases',
        permissions: ['purchase_management', 'wholesale_market']
    },
    {
        label: 'HRM',
        icon: FaIdCard,
        child: [
            {
                label: 'Roles',
                icon: FaStar,
                href: '/admin/hrm/roles',
                childHrefs: ['/admin/hrm/roles/add', "/admin/hrm/roles/[_id]"],
                permission: 'role_show'
            },
            {
                label: 'Users',
                icon: FaUsers,
                href: '/admin/hrm/users',
                childHrefs: ['/admin/hrm/users/add', "/admin/hrm/users/[_id]", "/admin/hrm/users/edit/[_id]"],
                permission: 'user_show'
            },
        ]
    },
    {
        label: 'Report',
        icon: FaPrint,
        child: [
            {
                label: 'Sales Report',
                icon: FaListUl,
                href: '/admin/report/sales',
                permission: "sale_report"
            },
            {
                label: 'Purchases Report',
                icon: FaListUl,
                href: '/admin/report/purchases',
                permission: "purchase_report"
            },
            {
                label: 'Card Transaction Report',
                icon: FaListUl,
                href: '/admin/report/transactions',
                permission: "transaction_report"
            },
        ]
    },
    {
        label: 'Settings',
        icon: FaWrench,
        href: "/admin/settings",
        permission: 'site_admin',
    },
]

const getMenu = user => {
    const router = useRouter()
    const hasPermission = menu => {
        if (menu.permission && havePermission(menu.permission, user?.roles)) {
            return true
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (havePermission(permission, user?.roles)) {
                    return true
                }
            }
        }
        if (process.browser) {
            if (router?.pathname === menu.href && user) {
                router?.push('/').then(() => {
                })
            }
        }
        return false
    }
    return menu?.map(d => ({...d})).filter(menu => {
        if (user?.admin === true) {
            return true
        } else if (menu?.permission === 'any') {
            return true
        } else if (menu.permission || menu.permissions) {
            return hasPermission(menu)
        } else if (Array.isArray(menu.child)) {
            menu.child = menu.child.filter(child => {
                return hasPermission(child)
            })
            return menu.child.length > 0
        }
        return false
    })
}

export const havePermission = (permission, roles) => {
    for (let role of roles || []) {
        if (role.permissions.includes(permission)) {
            return true
        }
    }
    return false
}