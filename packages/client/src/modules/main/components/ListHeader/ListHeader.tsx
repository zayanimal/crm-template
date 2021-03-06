import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import { bem } from '@interaktiv/utils'
import './ListHeader.scss'

const cn = bem('ListHeader')

interface Props {
    onAction?: () => void
}

const ListHeader: React.FC<Props> = (props) => {
    const { onAction = () => {} } = props
    const { path } = useRouteMatch()
    const history = useHistory()

    const onAdd = () => {
        onAction()

        history.push({ pathname: `${path}/add` })
    }

    return (
        <div className={cn()}>
            <IconButton size="medium" onClick={onAdd}>
                <AddIcon />
            </IconButton>
        </div>
    )
}

export { ListHeader }
