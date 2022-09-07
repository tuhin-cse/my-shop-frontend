import UserLayout, {havePermission} from "../../../../../layouts/user";
import PageTitle from "../../../../../components/common/page-title";
import Card from "../../../../../components/common/card";
import {useRouter} from "next/router";
import {Checkbox} from "antd";
import {useAction, useFetch} from "../../../../../helpers/hooks";
import {fetchPermissions, fetchRole, postPermissions} from "../../../../../helpers/backend_helper";
import Table from "../../../../../components/common/table";
import {useEffect, useState} from "react";
import Button from "../../../../../components/common/button";
import {useUserContext} from "../../../../../contexts/user";

const Permissions = () => {
    const {query, push} = useRouter()
    const [role] = useFetch(fetchRole, {...query, permissions: true})
    const [elements] = useFetch(fetchPermissions)
    const user = useUserContext()

    const [update, setUpdate] = useState(false)
    const reload = () => setUpdate(!update)
    const [permissions, setPermissions] = useState([])

    useEffect(() => {
        if (role) {
            setPermissions(role?.permissions)
        }
    }, [role])

    const isChecked = data => {
        if (data?.child) {
            for (let c of data.child) {
                if (permissions?.includes(c?.permission)) {
                    return true
                }
            }
        }
        if (permissions.includes(data?.permission)) {
            return true
        }
        return false
    }

    const handleChange = (e, data) => {
        if (e.target.checked === true) {
            if (data.child) {
                setPermissions([...permissions, ...data?.child?.map(d => d.permission)])
            } else {
                permissions.push(data.permission)
            }
        } else {
            let p = data?.child ? data?.child?.map(d => d.permission) : [data.permission]
            setPermissions(permissions?.filter(d => !p.includes(d)))
        }
        reload()
    }

    const admin = havePermission('site_admin', user?.roles)
    const Check = ({d}) => <Checkbox onChange={e => handleChange(e, d)} checked={isChecked(d)}/>

    const columns = [
        {text: '#', dataField: '', formatter: (_, d) => <Check d={d}/>},
        {text: 'Name', dataField: 'name'},
        {
            text: 'Create',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_create`, user?.roles)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_create`)}/>
        },
        {
            text: 'Edit',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_edit`, user?.roles)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_edit`)}/>
        },
        {
            text: 'Delete',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_delete`, user?.roles)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_delete`)}/>
        },
        {
            text: 'View',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_show`, user?.roles)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_show`)}/>
        },
    ]

    return (
        <>
            <PageTitle title="Roles"/>
            <Card>
                <h2 className="text-xl">Permissions - <span className="text-danger">( {role?.name} )</span></h2>
                <Table
                    noHeader
                    noActions
                    shadow={false}
                    columns={columns}
                    data={elements?.filter(d => {
                        if (admin) {
                            return true
                        }
                        if (havePermission(d.permission, user.roles)) {
                            return true
                        }
                        if (d?.child) {
                            for (let c of d.child) {
                                if (havePermission(c.permission, user.roles)) {
                                    return true
                                }
                            }
                        }
                        return false
                    })?.map(d => {
                        return {
                            ...d,
                            child: d?.child ? admin ? d.child : d.child?.filter(d => havePermission(d.permission, user?.roles)) : undefined
                        }
                    })}
                />
                <Button onClick={() => {
                    return useAction(postPermissions, {role: query._id, permissions}, () => {
                        push('/admin/hrm/roles')
                    })
                }}>Save</Button>
            </Card>
        </>
    )
}
Permissions.layout = UserLayout
export default Permissions