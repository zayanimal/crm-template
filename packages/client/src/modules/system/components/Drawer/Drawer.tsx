import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '@icons/logo.png'
import { LayoutProps } from '@system/containers/Layout'
import { bem } from '@interaktiv/utils'
import { DrawerIcon } from './DrawerIcon'
import './Drawer.scss'

const cn = bem('Drawer')

const Drawer: React.FC<LayoutProps> = (props) => {
    const { drawerState, authFetched, routerItems, getRouterItems } = props

    const [hide, setHide] = useState(drawerState)

    useEffect(() => {
        if (authFetched && !routerItems.length) {
            getRouterItems()
        }

        if (drawerState) {
            setHide(drawerState)
        } else {
            const TIME_OUT = 200

            setTimeout(() => {
                setHide(drawerState)
            }, TIME_OUT)
        }
    }, [drawerState, authFetched, routerItems, getRouterItems])

    return (
        <aside className={drawerState ? cn('', 'close') : cn()}>
            <div className={cn('header')}>
                <img src={logo} alt="Iskor" hidden={hide} />
            </div>
            <ul className={cn('list')}>
                {routerItems.map((menuItem) => (
                    <li key={menuItem.key}>
                        <NavLink
                            to={menuItem.path}
                            className={cn('item')}
                            activeClassName={cn('item_focus')}>
                            {DrawerIcon(menuItem.icon)}
                            <span className={cn('item-text')} hidden={hide}>
                                {menuItem.name}
                            </span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export { Drawer }
