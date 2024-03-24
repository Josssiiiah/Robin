import { Outlet } from '@remix-run/react'
import React from 'react'
import { LeftSidebar } from './leftSidebar'


export default function route() {
  return (
    <div>
        <LeftSidebar />
        <Outlet />

    </div>
  )
}
