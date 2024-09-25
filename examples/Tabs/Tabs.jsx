import React, {memo, useCallback} from 'react';
import {classNames} from '@/shared/lib/classNames/classNames';
import {Card, CardTheme} from '../Card/Card';
import cls from './Tabs.module.scss';


export const Tabs = memo((props) => {
    const { className, tabs, onTabClick, value } = props;

    const clickHandler = useCallback(
        (tab) => () => {
            onTabClick(tab);
        },
        [onTabClick],
    );

    return (
        <div className={classNames(cls.Tabs, {}, [className])}>
            {tabs.map((tab) => (
                <Card
                    className={
                        tab.value === value
                            ? cls.selectedTab
                            : cls.notSelectedTab
                    }
                    // theme={
                    //     tab.value === value
                    //         ? CardTheme.OUTLINED
                    //         : CardTheme.NORMAL
                    // }
                    key={tab.value}
                    onClick={clickHandler(tab)}
                >
                    {tab.content}
                </Card>
            ))}
        </div>
    );
});