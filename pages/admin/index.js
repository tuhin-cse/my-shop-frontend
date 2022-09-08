import PageTitle from "../../components/common/page-title";
import UserLayout from "../../layouts/user";
import Card from "../../components/common/card";
import {FaArchive, FaDollarSign, FaShoppingBag} from "react-icons/fa";
import {useFetch} from "../../helpers/hooks";
import {fetchDashboard} from "../../helpers/backend_helper";
import moment from "moment";

const Dashboard = () => {
    const [dashboard] = useFetch(fetchDashboard, {date: moment().startOf('day').toISOString()})

    return (
        <>
            <PageTitle title="Dashboard" hidden/>
            <div className="row">
                {dashboard?.overview && (
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <DashboardCard
                            icon={FaArchive}
                            label="Total Sales"
                            title="Total Summary"
                            child={[
                                {label: 'Product', value: dashboard?.overview?.products},
                                {label: 'Customer', value: 0},
                                {label: 'Today sale', value: dashboard?.overview?.today}
                            ]}
                            value={dashboard?.overview?.total}/>
                    </div>
                )}
                {(dashboard?.total_purchase || dashboard?.total_purchase === 0) && (
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <DashboardCard icon={FaDollarSign} label="Total Purchase"
                                       value={"$" + (dashboard?.total_purchase || 0)}/>
                    </div>
                )}
                {(dashboard?.total_sale || dashboard?.total_sale === 0) && (
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <DashboardCard icon={FaShoppingBag} label="Total Sale"
                                       value={"$" + (dashboard?.total_sale || 0)}/>
                    </div>
                )}

                <div className="row">
                    {dashboard?.companies_overview && (
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <DashboardCard
                                icon={FaArchive}
                                label="Total Beneficiaries"
                                title="Companies Summary"
                                child={[
                                    {label: 'Companies', value: dashboard?.companies_overview?.companies},
                                    {label: 'Projects', value: dashboard?.companies_overview?.projects},
                                    {label: 'Cards', value: dashboard?.companies_overview?.cards}
                                ]}
                                value={dashboard?.companies_overview?.beneficiaries}/>
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}
Dashboard.layout = UserLayout
export default Dashboard


const DashboardCard = ({title, label, value, child, stats, icon: Icon}) => {
    return (
        <Card style={{color: '#6c757d'}}>
            <div className="h-20 mb-2">
                {title && <div className="card-stats-title mb-3">{title}</div>}
                {child && (
                    <div className="flex justify-evenly text-center">
                        {child?.map((d, index) => (
                            <div className="card-stats-item" key={index}>
                                <div className="card-stats-item-count">{d?.value}</div>
                                <div className="card-stats-item-label">{d?.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex mt-3">
                <div className="m-2">
                    <div className="bg-main p-2.5 rounded shadow-main">
                        {Icon && <Icon size={22} className="text-white m-2.5"/>}
                    </div>
                </div>
                <div className="p-2">
                    <p className="text-sm">{label}</p>
                    <div className="card-stats-value">
                        {value}
                    </div>
                </div>
            </div>
        </Card>
    )
}