import React, { useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStateTypes } from '@system/store/roots';
import { systemActions, dictionaryActions } from '@system/store/actions';
import { userControlActions, usersActions } from '@admin/store/actions';
import { userSelectors, userControlSelectors } from '@admin/store/selectors';
import { dictionarySelectors } from '@system/store/selectors';
import { Button } from '@material-ui/core';
import { UserAuthFields } from '@admin/components/UserAuthFields';
import { UserContactsFields } from '@admin/components/UserContactsFields';
import { bem } from '@utils/formatters';
import './UserControl.scss';

export const cn = bem('UserControl');

const mapStateToProps = (state: RootStateTypes) => ({
    dicts: dictionarySelectors.dictionaries(state),
    userEditMode: userSelectors.userEditMode(state),
    userEditName: userSelectors.userEditName(state),
    username: userControlSelectors.username(state),
    password: userControlSelectors.password(state),
    role: userControlSelectors.role(state),
    permissions: userControlSelectors.permissions(state),
    email: userControlSelectors.email(state),
    phone: userControlSelectors.phone(state),
    position: userControlSelectors.position(state),
    validFields: userControlSelectors.validFields(state),
});

const mapDispatchToProps = {
    setHeaderTitle: systemActions.setHeaderTitle,
    getDictionary: dictionaryActions.getDictionary,
    clearDictionary: dictionaryActions.clearDictionary,
    setUserEditMode: usersActions.setUserEditMode,
    setUsername: userControlActions.setUsername,
    setPassword: userControlActions.setPassword,
    setRole: userControlActions.setRole,
    setPermissions: userControlActions.setPermissions,
    setEmail: userControlActions.setEmail,
    setPhone: userControlActions.setPhone,
    setPosition: userControlActions.setPosition,
    addNewUser: userControlActions.addNewUser,
    clearUserData: userControlActions.clearUserData,
};

export type UserControlProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UserControl: React.FC<UserControlProps> = (props) => {
    const {
        setHeaderTitle,
        getDictionary,
        userEditMode,
        setUserEditMode,
        clearDictionary,
        validFields,
        addNewUser,
        clearUserData,
    } = props;

    const { path } = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        getDictionary(['roles', 'permissions']);

        if (path.includes('edit')) {
            setHeaderTitle('Редактирование пользователя');
            setUserEditMode(true);
        } else {
            setHeaderTitle('Добавление пользователя');
            setUserEditMode(false);
        }

        return () => { clearDictionary(); };
    }, [
        getDictionary,
        clearDictionary,
        setHeaderTitle,
        path,
        setUserEditMode,
    ]);

    const onCancel = () => {
        clearUserData();
        history.push('/users');
    };

    return (
        <>
            <div className={cn()}>
                <div className={cn('column')}>
                    <h3>Аутентификация</h3>
                    <UserAuthFields {...props} />
                </div>
                <div className={cn('column')}>
                    <h3>Контакты</h3>
                    <UserContactsFields {...props} />
                </div>
            </div>
            <div className={cn('controls')}>
                <Button
                    variant="text"
                    color="primary"
                    onClick={onCancel}
                >
                    Назад
                </Button>
                <Button
                    disabled={validFields}
                    variant="text"
                    color="primary"
                    onClick={addNewUser}
                >
                    {userEditMode ? 'Редактировать' : 'Добавить'}
                </Button>
            </div>
        </>
    );
};

const UserControlConnected = connect(mapStateToProps, mapDispatchToProps)(UserControl);

export { UserControlConnected as UserControl };