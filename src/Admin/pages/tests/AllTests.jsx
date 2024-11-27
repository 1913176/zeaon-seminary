import React from 'react'
import LeftBar from '../../components/global/sidebar/LeftBar'
import './test.css'
import TetsList from './TetsList'

const AllTests = () => {
    return (
        <div className="users-page-dashboard">
            <LeftBar />
            <TetsList />
        </div>
    )
}

export default AllTests