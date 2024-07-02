import React, {useEffect} from 'react'

import { Link } from 'react-router-dom'

import Chart from 'react-apexcharts'

import { useSelector } from 'react-redux'

import StatusCard from '../components/status-card/StatusCard'

import Table from '../components/table/Table'

import Badge from '../components/badge/Badge'

import statusCards from '../assets/JsonData/status-card-data.json'

const chartOptions = {
    series: [{
        name: 'Active Candidates',
        data: [40,70,20,90,36,80,30,91,60]
    }, {
        name: 'Top Candidates',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10]
    }],
    options: {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        },
        legend: {
            position: 'top'
        },
        grid: {
            show: false
        }
    }
}

const topCustomers = {
    head: [
        'user',
        'tests',
        'result'
    ],
    body: [
        {
            "username": "Amar Sutar",
            "tests": "49",
            "result": "98%"
        },
        {
            "username": "Jyoti Mane",
            "tests": "46",
            "result": "97%"
        },
        {
            "username": "Ankita Tiwari",
            "tests": "45",
            "result": "96%"
        },
        {
            "username": "Suresh Kumar",
            "tests": "45",
            "result": "94%"
        },
        {
            "username": "Ashutosh Kulkarni",
            "tests": "45",
            "result": "92%"
        }
    ]
}

const renderCusomerHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderCusomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.username}</td>
        <td>{item.tests}</td>
        <td>{item.result}</td>
    </tr>
)

const latestOrders = {
    header: [
        "user id",
        "user",
        "total Tests",
        "joined date",
        "Result"
    ],
    body: [
        {
            id: "#OD1711",
            user: "Sangita Jha",
            date: "17 Jun 2021",
            tests: "9",
            result: "30%"
        },
        {
            id: "#OD1712",
            user: "Navin Kumar",
            date: "1 Jun 2021",
            tests: "9",
            result: "60%"
        },
        {
            id: "#OD1713",
            user: "Priyanka Mane",
            date: "27 Jun 2021",
            tests: "9",
            result: "70%"
        },
        {
            id: "#OD1712",
            user: "Suman Kali",
            date: "1 Jun 2021",
            tests: "9",
            result: "90%"
        },
        {
            id: "#OD1713",
            user: "Aman Sutar",
            date: "27 Jun 2021",
            tests: "9",
            result: "20%"
        }
    ]
}

const orderStatus = {
    "10%": "danger",
    "20%": "danger",
    "30%": "danger",
    "40%": "danger",
    "50%": "danger",
    "55%": "danger",
    "60%": "warning",
    "65%": "warning",
    "70%": "primary",
    "75%": "primary",
    "80%": "primary",
    "85%": "success",
    "90%": "success",
    "95%": "success",
    "100%": "success"
    
}

const renderOrderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.user}</td>
        <td>{item.tests}</td>
        <td>{item.date}</td>
        <td>
            <Badge type={orderStatus[item.result]} content={item.result}/>
        </td>
    </tr>
)

const Dashboard = () => {

    const themeReducer = useSelector(state => state.ThemeReducer.mode)

    return (
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {
                            statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={item.count}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* chart */}
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...chartOptions.options,
                                theme: { mode: 'dark'}
                            } : {
                                ...chartOptions.options,
                                theme: { mode: 'light'}
                            }}
                            series={chartOptions.series}
                            type='line'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card__header">
                            <h3>Top Candidates</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={topCustomers.head}
                                renderHead={(item, index) => renderCusomerHead(item, index)}
                                bodyData={topCustomers.body}
                                renderBody={(item, index) => renderCusomerBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/'>view all</Link>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card__header">
                            <h3>All Candidate Results</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={latestOrders.header}
                                renderHead={(item, index) => renderOrderHead(item, index)}
                                bodyData={latestOrders.body}
                                renderBody={(item, index) => renderOrderBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/'>view all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
